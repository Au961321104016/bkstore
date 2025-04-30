import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
// import { getUserFromToken } from "@/utils/auth"; // Uncomment if using JWT auth

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // ✅ Optional admin check
      // const user = await getUserFromToken(req);
      // if (!user || user.role !== "ADMIN") {
      //   return res.status(403).json({ error: "Access denied. Admins only." });
      // }

      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
      return res.status(200).json(users);
    } catch (error) {
      console.error("Fetch users error:", error);
      return res.status(500).json({ error: "Error fetching users" });
    }
  }

  if (req.method === "POST") {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Validate and assign role
      const validRoles = Object.values(Role); // ['USER', 'ADMIN']
      const userRole: Role = role && validRoles.includes(role) ? role : Role.USER;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: userRole,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("User creation error:", error);
      return res.status(500).json({ error: "Error creating user" });
    }
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
