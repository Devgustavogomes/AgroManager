import { Request } from 'express';
import { Role } from './role';

export interface AuthenticatedRequest extends Request {
  producer: {
    id: string;
    username: string;
    role: Role;
    CPForCNPJ: string;
  };
}
