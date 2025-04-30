import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid cart item ID" });
    }

    switch (req.method) {
      // 🔹 Get a single cart item by ID
      case "GET": {
        const cartItem = await prisma.cartItem.findUnique({
          where: { id },
          include: { book: true }, // Include book details
        });

        if (!cartItem) {
          return res.status(404).json({ error: "Cart item not found" });
        }

        return res.status(200).json(cartItem);
      }

      // 🔹 Update cart item quantity
      case "PUT": {
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
          return res.status(400).json({ error: "Invalid cart item update" });
        }

        const updatedItem = await prisma.cartItem.update({
          where: { id },
          data: { quantity },
        });

        return res.status(200).json(updatedItem);
      }

      // 🔹 Remove item from cart
      case "DELETE": {
        await prisma.cartItem.delete({ where: { id } });
        return res.status(200).json({ message: "Item removed from cart" });
      }

      // 🚨 Invalid method
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Cart API error:", error);
    return res.status(500).json({ error: "Server error", details: error.message || error });
  }
}
