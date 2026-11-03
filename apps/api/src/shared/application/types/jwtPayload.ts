import { Role } from './role';

export interface JwtPayload extends Record<string, unknown> {
  id: string;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}
