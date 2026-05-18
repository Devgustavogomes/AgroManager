import { Role } from 'src/shared/types/role';

export interface ProducerProps {
  id_producer?: string;
  username: string;
  email: string;
  role?: Role;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date | null;
}

export class ProducerEntity {
  private id_producer?: string;
  private username: string;
  private email: string;
  private role: Role;
  private password_hash: string;
  private created_at: Date;
  private updated_at: Date | null;

  constructor({
    id_producer,
    username,
    email,
    password_hash,
    created_at,
    updated_at,
    role,
  }: ProducerProps) {
    this.id_producer = id_producer;
    this.username = username;
    this.email = email;
    this.role = role ?? Role.USER;
    this.password_hash = password_hash;
    this.created_at = created_at ?? new Date();
    this.updated_at = updated_at ?? null;
  }

  getEmail(): string {
    return this.email;
  }
  getPassword(): string {
    return this.password_hash;
  }
  getUsername(): string {
    return this.username;
  }
}
