import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getUserFromTokenServer } from "@/utils/getuserFromtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const user = await getUserFromTokenServer(token);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  const userId = user.userId;

  if (req.method === "GET") {
    try {
      const wishlist = await prisma.wishlist.findMany({
        where: { userId },
        include: { book: true },
      });
      return res.status(200).json(wishlist);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching wishlist", error });
    }
  }

  if (req.method === "POST") {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Missing bookId" });
    }

    try {
      const existing = await prisma.wishlist.findFirst({
        where: { userId, bookId },
      });

      if (existing) {
        return res.status(409).json({ message: "Book already in wishlist" });
      }

      const added = await prisma.wishlist.create({
        data: { userId, bookId },
      });

      return res.status(201).json(added);
    } catch (error) {
      return res.status(500).json({ message: "Error adding to wishlist", error });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
