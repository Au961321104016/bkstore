// /api/wishlist/[bookId].ts
import { NextApiRequest, NextApiResponse } from "next";
import  prisma  from "@/lib/prisma";
import { getUserFromTokenServer } from "@/utils/getuserFromtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  const user = getUserFromTokenServer(token || "");

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const userId = user.userId;
  const { bookId } = req.query;

  if (req.method === "DELETE") {
    await prisma.wishlist.deleteMany({
      where: {
        userId,
        bookId: String(bookId),
      },
    });

    return res.status(200).json({ message: "Removed from wishlist" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
