import { ComponentWithAs, Input, InputProps } from '@chakra-ui/react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface ControllableInputsProps {
  field: 'email' | 'password' | 'text' | 'submit';
  register?: UseFormRegisterReturn;
}

type Props = InputProps & ControllableInputsProps;

type InputStyleType = {
  '1x': InputProps;
};

const styleInputs: InputStyleType = {
  '1x': {
    width: '25rem'
  }
};

const ControllableInputs: ComponentWithAs<'input', Props> = (props: Props) => {
  const { field, register } = props;
  switch (field) {
    case 'email':
      return <Input type="email" {...register} {...styleInputs['1x']} {...props} />;
    case 'password':
      return <Input type="password" {...register} {...styleInputs['1x']} {...props} />;
    default:
      return <Input type="submit" {...styleInputs['1x']} {...props} />;
  }
};

export default ControllableInputs;
