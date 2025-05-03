import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Middleware to check if user is authorized (admin check)
  const checkAdmin = (req: NextApiRequest) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    if (!token) return false;

    try {
      const decoded: any = jwt.verify(token, SECRET_KEY);
      return decoded.role === "ADMIN"; // Check if user is an admin
    } catch (error) {
      return false;
    }
  };

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: String(id) },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching user" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { name, password } = req.body;

      let updatedData: Partial<any> = { name };
      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id: String(id) },
        data: updatedData,
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: "Error updating user" });
    }
  }

  if (req.method === "DELETE") {
    // if (!checkAdmin(req)) {
    //   return res.status(403).json({ error: "Unauthorized" }); // Only admins can delete users
    // }

    try {
      await prisma.user.delete({ where: { id: String(id) } });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: "Error deleting user" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
