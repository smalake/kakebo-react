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
}

export interface LoginForm {
  email: string;
  password: string;
}
