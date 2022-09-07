import { Button, ButtonGroup, ButtonProps, ButtonGroupProps } from '@chakra-ui/react';
import { FC } from 'react';

export const Btn: FC<ButtonProps> = (props) => {
  const { children } = props;
  return <Button {...props}>{children}</Button>;
};

export const BtnGroups: FC<ButtonGroupProps> = (props) => {
  const { children } = props;
  return <ButtonGroup {...props}>{children}</ButtonGroup>;
};
