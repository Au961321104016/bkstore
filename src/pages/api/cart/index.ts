import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      // 🔹 Get all cart items for a user
      case "GET": {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        const cartItems = await prisma.cartItem.findMany({
          where: { userId: String(userId) },
          include: { book: true }, // Include book details
        });

        return res.status(200).json(cartItems);
      }

      // 🔹 Add a new item to the cart
      case "POST": {
        const { userId, bookId, quantity = 1 } = req.body;

        if (!userId || !bookId) {
          return res.status(400).json({ error: "User ID and Book ID are required" });
        }

        // 🔍 Check if the user exists
        const userExists = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!userExists) {
          return res.status(404).json({ error: "User not found" });
        }

        // 🔍 Check if the book exists
        const bookExists = await prisma.book.findUnique({
          where: { id: bookId },
        });

        if (!bookExists) {
          return res.status(404).json({ error: "Book not found" });
        }

        // 🔍 Check if item already exists in the cart
        const existingItem = await prisma.cartItem.findFirst({
          where: { userId, bookId },
        });

        let cartItem;
        if (existingItem) {
          // Update quantity if the item already exists
          cartItem = await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity },
          });
        } else {
          // Create a new cart item if not found
          cartItem = await prisma.cartItem.create({
            data: { userId, bookId, quantity },
          });
        }

        return res.status(201).json(cartItem);
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
