import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      let orders;

      if (userId) {
        const parsedUserId = Array.isArray(userId) ? userId[0] : userId;

        orders = await prisma.order.findMany({
          where: { userId: parsedUserId },
          include: {
            orderItems: {
              include: { book: true },
            },
          },
        });
      } else {
        orders = await prisma.order.findMany({
          include: {
            orderItems: {
              include: { book: true },
            },
          },
        });
      }

      return res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching orders',
        error: error.message,
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, items } = req.body;

      const parsedUserId = Array.isArray(userId) ? userId[0] : userId;

      if (!parsedUserId || !items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Missing or invalid order data',
        });
      }

      // Calculate total amount
      const total = items.reduce((sum: number, item: any) => {
        return sum + item.price * item.quantity;
      }, 0);

      // Create the order in database
      const newOrder = await prisma.order.create({
        data: {
          total,
          user: { connect: { id: parsedUserId } },
          orderItems: {
            create: items.map((item: any) => ({
              bookId: item.bookId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: { book: true },
          },
        },
      });

      // Send confirmation email
      try {
        const user = await prisma.user.findUnique({
          where: { id: parsedUserId },
        });

        if (user?.email) {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Order Confirmation',
            text: `Your order with ID ${newOrder.id} has been placed successfully.`,
          });
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails
      }

      return res.status(201).json({ success: true, data: newOrder });
    } catch (error: any) {
      console.error('Error creating order:', error);
      return res.status(500).json({
        success: false,
        message: 'Error creating order',
        error: error.message,
      });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
