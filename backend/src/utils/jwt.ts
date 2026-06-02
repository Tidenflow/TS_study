import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload as object, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
}
