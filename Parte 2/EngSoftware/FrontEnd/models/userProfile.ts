export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt?: string;
  profile: {
    avatar: string | null;
    bio: string;
    locale?: string;
    timezone?: string;
  };
  settings: {
    notifications?: boolean;
    remindersDefault?: string;
    privateByDefault?: boolean;
  };
  friends: number[];
  stats: { points: number; level: number };
  points?: number;
  level?: number;
  user?: any;
}
