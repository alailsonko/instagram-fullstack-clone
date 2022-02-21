import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';
import Input from 'infra/components/Forms/Input/ControllableInputs';
import { Form, FormErrorMessageInput } from 'infra/components/Forms/Form';
import { CSSProperties, FC } from 'react';
import { SignUpFormProps, SubmitSignUpHandler } from 'domain/usecases/signup';

interface Props {
  onSubmit: SubmitSignUpHandler;
}

const SignUpFormBlock: FC<Props> = (props) => {
  const { onSubmit } = props;
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<SignUpFormProps>();

  const stylesInput: CSSProperties = {
    borderRadius: '0px'
  };

  const stylesButton: CSSProperties = {
    borderRadius: '0px',
    width: '100%'
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Form mb={2} isInvalid={!!errors.email}>
        <Input
          id="email"
          placeholder="Email"
          field="email"
          register={register('email', {
            required: 'Email is required.'
          })}
          style={stylesInput}
        />
        <FormErrorMessageInput>{errors.email && errors.email.message}</FormErrorMessageInput>
      </Form>
      <Form mb={2} isInvalid={!!errors.email}>
        <Input
          id="username"
          placeholder="Username"
          field="text"
          register={register('username', {
            required: 'Username is required.'
          })}
          style={stylesInput}
        />
        <FormErrorMessageInput>{errors.username && errors.username.message}</FormErrorMessageInput>
      </Form>
      <Form mb={2} isInvalid={!!errors.password}>
        <Input
          id="password"
          placeholder="Password"
          field="password"
          register={register('password', {
            required: 'Password is required.',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters.'
            }
          })}
          style={stylesInput}
        />
        <FormErrorMessageInput>{errors.password && errors.password.message}</FormErrorMessageInput>
      </Form>
      <Form isInvalid={!!errors.password}>
        <Input
          id="passwordConfirm"
          placeholder="Repeat password"
          field="password"
          register={register('passwordConfirm', {
            required: 'passwordConfirm is required.',
            minLength: {
              value: 6,
              message: 'passwordConfirm must be at least 6 characters.'
            }
          })}
          style={stylesInput}
        />
        <FormErrorMessageInput>
          {errors.passwordConfirm && errors.passwordConfirm.message}
        </FormErrorMessageInput>
      </Form>
      <Button mt={2} style={stylesButton} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpFormBlock;
