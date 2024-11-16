// Middlewares/AuthMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define an interface for the decoded token payload
interface DecodedToken extends JwtPayload {
  userId: number; // Adjust type if necessary
  role: string;
  // Add other properties based on your token payload
}

// Create a custom request interface extending Express.Request
interface AuthenticatedRequest extends Request {
  user?: any;
}

const secret = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to authenticate the token
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, secret, (err, decoded: JwtPayload | undefined) => {
    if (err || !decoded) {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    req.user = decoded as DecodedToken;
    next();
  });
}

// Middleware to check if the user has the required role(s)
export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response => {
    const user = req.user;

    if (user && allowedRoles.includes(user.role)) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
    }
  };
}

// Middleware for validating reservation creation
export function  validateCreateReservation (req: Request, res: Response, next: NextFunction) {
  const { checkInDate, checkOutDate, guestId, roomId, totalAmount } = req.body;
  if (!checkInDate || !checkOutDate || !guestId || !roomId || !totalAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  // Additional validation logic (e.g., date formats, numeric checks) can be added here
  next();
};

// Middleware for validating reservation status update
export function validateUpdateReservationStatus (req: Request, res: Response, next: NextFunction) {
  const { id, status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ message: 'Missing reservation ID or status' });
  }
  // Validate status value (e.g., 'pending', 'confirmed', 'cancelled')
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  next();
};


// Example usage:
// app.use('/admin', authenticateToken, authorizeRoles('admin'));
// app.use('/editor', authenticateToken, authorizeRoles('admin', 'editor'));
