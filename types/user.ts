export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  admin_status?: "pending" | "approved";
  admin_depth?: number;
  approved_by?: string | null;
}
