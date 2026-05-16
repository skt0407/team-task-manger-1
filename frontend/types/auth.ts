export type Role = "ADMIN" | "MEMBER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};
