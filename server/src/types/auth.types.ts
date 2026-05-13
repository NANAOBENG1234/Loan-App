export interface TokenPayload {
  id: string;
  phone: string;
  role: string;
}

export interface RegisterInput {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
}

export interface LoginInput {
  phone: string;
  password: string;
}
