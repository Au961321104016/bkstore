import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.headers;

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ message: 'Unauthorized: Missing token.' });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }

//   const { name, password, role } = req.body;

const { Email} = req.body;

  try {
    const updates: any = {};

    // if (name) updates.name = name;
    // if (password) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   updates.password = hashedPassword;
    // }

    // Only allow role update if current user is admin
    // if (role && decoded.role === 'ADMIN') {
    //   updates.role = role;
    // }
      if (Email ) {
       updates.email = Email;
     }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: updates,
    });

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
