import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: "User deleted", user });
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return res.status(500).json({ error: "Server error", details: error.message || error });
  }
}
