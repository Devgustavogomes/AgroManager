import { Role } from './role';

export interface JwtPayload extends Record<string, any> {
  id: string;
  username: string;
  role: Role;
}
