import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Prisma singleton client
import crypto from 'crypto';
import nodemailer from 'nodemailer';

interface UserSignup {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

const generateOtp = () => crypto.randomBytes(3).toString('hex'); // Generate a 6-digit OTP

// Setup in-memory OTP store (safe only for dev or single-instance prod)
const globalForOtp = globalThis as unknown as { otpStore: Record<string, { otp: string; data: UserSignup; timestamp: number }> };
if (!globalForOtp.otpStore) globalForOtp.otpStore = {};

const otpStore = globalForOtp.otpStore;

// Set up Nodemailer transporter with Gmail SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



// Function to send OTP email
const sendOtpEmail = async (toEmail: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"Bookstore" <${process.env.EMAIL_USERNAME}>`,
      to: toEmail,
      subject: 'Your OTP Code',
      html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });
  } catch (error: any) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Failed to send OTP email. Please try again later.');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') return handleSignup(req, res);
  if (req.method === 'DELETE') return handleDeleteUser(req, res);

  return res.status(405).json({ success: false, message: 'Method not allowed.' });
}

const handleSignup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password, role }: UserSignup = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists.' });
  }

  // Generate OTP
  const otp = generateOtp();
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store user details and OTP temporarily in memory
  otpStore[email] = { otp, data: { name, email, password: hashedPassword, role }, timestamp: Date.now() };

  try {
    // Send OTP email to the user
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      success: true,
      message: 'OTP sent to email.',
      otp,  // You can remove this in production; it's for debugging purposes
    });
  } catch (error: any) {
    console.error('Email send failed:', error.message);

    // Clean up stored data if email fails
    delete otpStore[email];

    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again later.',
    });
  }
};

// Handle user deletion
const handleDeleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required to delete a user.' });
  }

  try {
    const deletedUser = await prisma.user.delete({ where: { email } });
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
      deletedUser: { id: deletedUser.id, email: deletedUser.email },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not delete user.' });
  }
};
