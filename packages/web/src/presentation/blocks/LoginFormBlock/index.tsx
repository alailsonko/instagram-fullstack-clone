import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/react';
import Input from 'infra/components/Forms/Input/ControllableInputs';
import { Form, FormErrorMessageInput } from 'infra/components/Forms/Form';
import { CSSProperties, FC } from 'react';
import { LoginFormProps, SubmitLoginHandler } from 'domain/usecases/login';

interface Props {
  onSubmit: SubmitLoginHandler;
}

const LoginFormBlock: FC<Props> = (props) => {
  const { onSubmit } = props;
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormProps>();

  const stylesInput: CSSProperties = {
    borderRadius: '0px'
  };

  const stylesButton: CSSProperties = {
    borderRadius: '0px',
    width: '25em'
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Form mb={2} isInvalid={!!errors.email}>
        <Input
          id="email"
          placeholder="email"
          field="email"
          register={register('email', {
            required: 'Email is required.'
          })}
          style={stylesInput}
        />
        <FormErrorMessageInput>{errors.email && errors.email.message}</FormErrorMessageInput>
      </Form>
      <Form isInvalid={!!errors.password}>
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
          style={stylesInput}
        />
        <FormErrorMessageInput>{errors.password && errors.password.message}</FormErrorMessageInput>
      </Form>
      <Button mt={2} style={stylesButton} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
};

export default LoginFormBlock;
