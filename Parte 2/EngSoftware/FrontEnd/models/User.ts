export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
    points: number;
    level: number;
    avatar_url?: string;
    is_active: boolean;
}