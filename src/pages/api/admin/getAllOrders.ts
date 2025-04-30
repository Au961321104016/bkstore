// pages/api/admin/getAllOrders.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            book: true,
          },
        },
        payment: true,
      },
    });

    return res.status(200).json(orders);
  } catch (error: any) {
    console.error("Admin getAllOrders error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
