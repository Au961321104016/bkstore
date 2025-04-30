// pages/api/payment/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { orderId, stripeId, amount, status } = req.body;

      // Validation
      if (!orderId || !stripeId || !amount || !status) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create new Payment record
      const newPayment = await prisma.payment.create({
        data: {
          orderId,
          stripeId,
          amount,
          status: status as PaymentStatus, // Ensure the status is valid
        },
      });

      return res.status(201).json(newPayment);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
} catch (error: any) {
    console.error("Error creating Payment:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
