// src/pages/api/admin/deleteBook.ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }

  try {
    await prisma.book.delete({
      where: {
        id: id, // ✅ Now Prisma expects string, and id is string.
      },
    });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Failed to delete book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
}
