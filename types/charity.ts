export interface Charity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  featured: boolean;
}

export interface UserCharity {
  user_id: string;
  charity_id: string;
  contribution_percentage: number;
}

export interface UserCharitySelection extends UserCharity {
  charity: Charity;
}
