import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  producer: {
    id: string;
    username: string;
    role: string;
    CPForCNPJ: string;
  };
}
