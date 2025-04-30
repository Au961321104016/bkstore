// pages/api/auth/check-admin.ts

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma'; // Import your Prisma client

// Your JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the "Authorization" header

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token is missing' });
    }

    try {
      // Verify the token
      const decoded: any = jwt.verify(token, JWT_SECRET);

      // Fetch the user from the database using the decoded user ID
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Check if the user is an admin
      if (user.role === 'ADMIN') {
        return res.status(200).json({ isAdmin: true });
      } else {
        return res.status(403).json({ success: false, message: 'You are not an admin' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
