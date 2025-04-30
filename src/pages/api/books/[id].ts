import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing book ID" });
  }

  if (req.method === "GET") {
    try {
      const book = await prisma.book.findUnique({ where: { id } });

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      return res.status(200).json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      return res.status(500).json({ error: "Error fetching book" });
    }
  }

  if (req.method === "PUT") {
    const { title, description, price, stock, author, category, imageUrl } = req.body;

    if (!title || !description || !price || !stock || !author || !category || !imageUrl) {
      return res.status(400).json({ error: "Missing required book fields" });
    }

    try {
      const updatedBook = await prisma.book.update({
        where: { id },
        data: { title, description, price, stock, author, category, imageUrl },
      });

      return res.status(200).json(updatedBook);
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ error: "Error updating book" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.book.delete({ where: { id } });
      return res.status(204).end();
    } catch (error) {
      console.error("Delete error:", error);
      return res.status(500).json({ error: "Error deleting book" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
