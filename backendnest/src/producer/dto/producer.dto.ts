enum Role {
  ADMIN,
  USER,
}
export interface ProducerDTO {
  name: string;
  CPForCNPJ: string;
  password: string;
  role: Role;
}
