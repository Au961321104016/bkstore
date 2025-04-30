import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, author, price, description, stock, category } = req.body;

  if (!title || !author || !price || !stock || !description || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
        category,
      },
    });

    return res.status(201).json(book);
  } catch (error) {
    console.error("❌ Failed to create book:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
