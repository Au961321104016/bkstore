import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // make sure prisma is correctly imported

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const books = await prisma.book.findMany();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}
