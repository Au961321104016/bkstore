// src/pages/api/auth/verify-OTP.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Import Prisma client

// Use globalThis to persist OTP data between API calls (works in dev or single-instance prod)
const globalForOtp = globalThis as unknown as { otpStore: Record<string, { otp: string; timestamp: number; data: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN' } }> };

if (!globalForOtp.otpStore) {
  globalForOtp.otpStore = {};
}

const otpStore = globalForOtp.otpStore;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
  }

  const entry = otpStore[email];

  if (!entry) {
    return res.status(400).json({ success: false, message: 'No OTP request found for this email.' });
  }

  // OTP expiry: 10 minutes (600000 ms)
  const otpExpiryTime = 600000;
  if (Date.now() - entry.timestamp > otpExpiryTime) {
    delete otpStore[email]; // Clean up expired OTP entry
    return res.status(400).json({ success: false, message: 'OTP expired.' });
  }

  if (entry.otp !== code) {
    return res.status(400).json({ success: false, message: 'Invalid OTP.' });
  }

  const { name, password, role } = entry.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
        isActive: true,
      },
    });

    // Clean up the OTP store after successful registration
    delete otpStore[email];

    return res.status(201).json({
      success: true,
      message: 'User registered and activated successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
