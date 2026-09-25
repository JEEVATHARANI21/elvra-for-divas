import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUser {
  id: number;
  email: string;
  role: 'customer' | 'admin' | 'super_admin';
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'elvra_divas_super_secret_jwt_key_2026';

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ success: false, message: 'Invalid or expired session token.' });
      return;
    }
    req.user = decoded as AuthUser;
    next();
  });
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    res.status(403).json({ success: false, message: 'Access forbidden: Admin privileges required.' });
    return;
  }
  next();
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  const secret = process.env.JWT_SECRET || 'elvra_divas_super_secret_jwt_key_2026';
  jwt.verify(token, secret, (_err, decoded) => {
    if (decoded) {
      req.user = decoded as AuthUser;
    }
    next();
  });
};
