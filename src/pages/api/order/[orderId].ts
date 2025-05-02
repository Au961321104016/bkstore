// /pages/api/orders/[orderId].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query;

  // Ensure that orderId is available in the query
  if (!orderId || Array.isArray(orderId)) {
    return res.status(400).json({ error: "Invalid or missing orderId parameter" });
  }

  try {
    if (req.method === "GET") {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              book: true,  // Include related book information
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      return res.status(200).json(order);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await prisma.$disconnect(); // Close Prisma connection (important in serverless environments)
  }
}
