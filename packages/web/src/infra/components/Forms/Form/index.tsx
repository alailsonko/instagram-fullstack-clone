import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormErrorMessageProps,
  FormLabel,
  FormLabelProps
} from '@chakra-ui/react';
import { FC } from 'react';

export const Form: FC<FormControlProps> = (props) => {
  const { children } = props;
  return <FormControl {...props}>{children}</FormControl>;
};

export const FormErrorMessageInput: FC<FormErrorMessageProps> = (props) => {
  const { children } = props;
  return <FormErrorMessage {...props}>{children}</FormErrorMessage>;
};

export const FormLabelInput: FC<FormLabelProps> = (props) => {
  const { children } = props;
  return <FormLabel {...props}>{children}</FormLabel>;
};
