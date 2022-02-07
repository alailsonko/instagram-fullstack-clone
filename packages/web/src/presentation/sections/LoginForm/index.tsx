import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';
import Input from 'infra/components/Forms/Input/ControllableInputs';
import { Form, FormErrorMessageInput, FormLabelInput } from 'infra/components/Forms/Form';
import { FC } from 'react';
import { LoginFormProps, SubmitLoginHandler } from 'domain/usecases/login';

interface Props {
  onSubmit: SubmitLoginHandler;
}

const LoginForm: FC<Props> = (props) => {
  const { onSubmit } = props;
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormProps>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Form isInvalid={!!errors.email}>
        <FormLabelInput htmlFor="email">Email</FormLabelInput>
        <Input
          id="email"
          placeholder="email"
          field="email"
          register={register('email', {
            required: 'Email is required.'
          })}
        />
        <FormErrorMessageInput>{errors.email && errors.email.message}</FormErrorMessageInput>
      </Form>
      <Form isInvalid={!!errors.password}>
        <FormLabelInput htmlFor="password">Password</FormLabelInput>
        <Input
          id="password"
          placeholder="password"
          field="password"
          register={register('password', {
            required: 'Password is required.',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters.'
            }
          })}
        />
        <FormErrorMessageInput>{errors.password && errors.password.message}</FormErrorMessageInput>
      </Form>
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
};

export default LoginForm;
