import { SubmitHandler } from 'react-hook-form';

export interface LoginFormProps {
  email: string;
  password: string;
}

export type SubmitLoginHandler = SubmitHandler<LoginFormProps>;
