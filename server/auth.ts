import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from './db';

const JWT_SECRET = process.env.GEMINI_API_KEY || 'amplify_ecommerce_super_secure_secret_key_2026';

// PBKDF2 Password Hashing
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function comparePassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(':');
    const computedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return computedHash === hash;
  } catch (err) {
    return false;
  }
}

// Handcrafted Cryptographically-Secure JWT (HMAC-SHA256 Base64URL)
export function signToken(payload: { id: string; email: string; role: string }): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7); // 7 Days Expiry
  const fullPayload = { ...payload, exp };

  const base64UrlEncode = (obj: any) => {
    return Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(fullPayload);

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerEncoded, payloadEncoded, signatureProvided] = parts;

    // Verify signature
    const signatureExpected = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signatureExpected !== signatureProvided) return null;

    // Decode and check expiry
    const payloadJson = Buffer.from(payloadEncoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
    const payload = JSON.parse(payloadJson);

    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
  } catch (err) {
    return null;
  }
}

// Custom request interface supporting our injected user payload
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

// Middleware: Authenticate generic users
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Missing token.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Authentication failed. Invalid or expired token.' });
  }

  req.user = decoded as AuthenticatedRequest['user'];
  next();
}

// Middleware: Authenticate Admin users only
export function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authMiddleware(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden. Admin privileges required.' });
    }
  });
}
