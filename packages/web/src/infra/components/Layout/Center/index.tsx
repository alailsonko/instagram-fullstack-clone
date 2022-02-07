import { Center, CenterProps, Square, SquareProps, Circle } from '@chakra-ui/react';
import { FC } from 'react';

export const CenterLayout: FC<CenterProps> = (props) => {
  const { children } = props;
  return <Center {...props}>{children}</Center>;
};

export const SquareLayout: FC<SquareProps> = (props) => {
  const { children } = props;
  return <Square {...props}>{children}</Square>;
};

export const CircleLayout: FC<SquareProps> = (props) => {
  const { children } = props;
  return <Circle {...props}>{children}</Circle>;
};
