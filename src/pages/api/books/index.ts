import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Incoming request:", req.method);

    if (req.method === "GET") {
      const books = await prisma.book.findMany();
      console.log("Fetched books:", books);
      return res.status(200).json(books);
    }

    if (req.method === "POST") {
      const { title, description, price, stock, author, category } = req.body;
      console.log("Received data:", req.body);

      if (!title || !price || !stock || !author || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Ensure price is correctly formatted
      const newBook = await prisma.book.create({
        data: { 
          title, 
          description, 
          price: parseFloat(price), // Convert to float
          stock, 
          author, 
          category 
        },
      });

      console.log("Book created:", newBook);
      return res.status(201).json(newBook);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message || "Unknown error" 
    });
  } finally {
    await prisma.$disconnect();
  }
}
