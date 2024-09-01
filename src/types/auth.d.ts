export interface RegisterForm {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterData {
  uid: string;
  name: string;
  type: number;
  key?: string | null;
}

export interface LoginForm {
  email: string;
  password: string;
}
