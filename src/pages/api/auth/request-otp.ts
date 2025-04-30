// src/pages/api/auth/request-otp.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface TempUserData {
  otp: string;
  expires: number;
  data: {
    name: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN';
  };
}

const globalForOtp = globalThis as unknown as { otpStore: Record<string, TempUserData> };
if (!globalForOtp.otpStore) globalForOtp.otpStore = {};
const otpStore = globalForOtp.otpStore;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required.' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000;

  otpStore[email] = { otp, expires, data: { name, email, password, role } };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Bookstore" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    return res.status(200).json({ success: true, message: 'OTP sent to email.' });
  } catch (error: any) {
    console.error('OTP send failed:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
}

export { otpStore };
