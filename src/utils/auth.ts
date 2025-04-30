import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use .env file for security

// 🔐 Hash Password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// 🔑 Compare Passwords
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// 🛡️ Generate JWT Token
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, SECRET_KEY, { expiresIn: "7d" });
};

// 🔍 Verify JWT Token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};
