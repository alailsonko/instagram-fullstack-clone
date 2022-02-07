import { FC } from 'react';
import { FieldError } from 'react-hook-form';

interface FieldErrorProps {
  field: FieldError | undefined;
}

export const FieldErrorMessage: FC<FieldErrorProps> = (props) => {
  const { field } = props;
  return field ? <span>{field.message}</span> : null;
};
