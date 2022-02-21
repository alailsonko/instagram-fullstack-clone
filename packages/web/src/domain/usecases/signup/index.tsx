import { SubmitHandler } from 'react-hook-form';

export interface SignUpFormProps {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export type SubmitSignUpHandler = SubmitHandler<SignUpFormProps>;
