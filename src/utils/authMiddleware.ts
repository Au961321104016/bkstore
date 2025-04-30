import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export const authenticate = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      (req as any).user = decoded;
      return handler(req, res);
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
