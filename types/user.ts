export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}
