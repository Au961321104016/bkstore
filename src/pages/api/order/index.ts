import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { Decimal } from '@prisma/client/runtime/library';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      const parsedUserId = Array.isArray(userId) ? userId[0] : userId;

      const orders = await prisma.order.findMany({
        where: parsedUserId ? { userId: parsedUserId } : undefined,
        include: {
          orderItems: {
            include: { book: true },
          },
        },
      });

      return res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching orders",
        error: error.message,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { userId, orderItems } = req.body;

      // Validation for missing or invalid order data
      if (!userId || !orderItems || !Array.isArray(orderItems)) {
        return res.status(400).json({ success: false, message: "Missing or invalid order data" });
      }

      // Calculate the total amount from the order items
      const total: number = orderItems.reduce((sum: number, item: any) => {
        return sum + item.price * item.quantity;
      }, 0);

      // Debugging log for total
      console.log("Calculated total:", total);

      // Create the order and handle the orderItems creation with Decimal type for price
      const newOrder = await prisma.order.create({
        data: {
          total: new Decimal(total), // Ensure Decimal is used for price fields
          user: { connect: { id: userId } },
          orderItems: {
            create: orderItems.map((item: any) => ({
              bookId: item.bookId,
              quantity: item.quantity,
              price: new Decimal(item.price), // Ensure Decimal is used
            })),
          },
        },
        include: {
          orderItems: {
            include: { book: true },
          },
        },
      });

      // Debugging log for new order creation
      console.log("Order created:", newOrder);

      // Attempt to send a confirmation email
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (user?.email) {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true, // Use secure connection
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          // Send confirmation email
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Order Confirmation",
            text: `Your order with ID ${newOrder.id} has been placed successfully.`,
          });

          console.log(`Email sent to ${user.email}`);
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Continue even if email fails, do not fail the whole request
      }

      return res.status(201).json({ success: true, data: newOrder });
    } catch (error: any) {
      console.error("Error creating order:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating order",
        error: error.message,
      });
    }
  }

  // If method is not GET or POST, return 405 Method Not Allowed
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
