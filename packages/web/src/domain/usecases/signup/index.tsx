import { SubmitHandler } from 'react-hook-form';

export interface SignUpFormProps {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export type SubmitSignUpHandler = SubmitHandler<SignUpFormProps>;

export interface User {
  idSerial: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}
export interface Register {
  token: string;
  user: User;
}
export interface SignUpResponse {
  register: Register;
}
