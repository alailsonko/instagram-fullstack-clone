import { ContainerProps } from '@chakra-ui/react';
import { ContainerLayout } from 'infra/components/Layout/Container';
import React, { FC } from 'react';

const LoginLayout: FC<ContainerProps> = (props) => {
  const { children } = props;
  return <ContainerLayout {...props}>{children}</ContainerLayout>;
};

export default LoginLayout;
