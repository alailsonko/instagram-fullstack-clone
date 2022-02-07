import { Container, ContainerProps } from '@chakra-ui/react';
import { FC } from 'react';

export const ContainerLayout: FC<ContainerProps> = (props) => {
  const { children } = props;
  return <Container {...props}>{children}</Container>;
};
