import { Request } from 'express';

// Define the shape of your user object based on your application needs
interface User {
  id: number; // or string depending on your user ID type
  role: string;
  // Add any other properties you want to include from the user object
}

// Extend the base Request interface to include the user property
export interface AuthenticatedRequest extends Request {
  user?: User; // The user property can be optional
}
