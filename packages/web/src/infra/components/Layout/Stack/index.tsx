import { Stack, HStack, VStack, StackProps } from '@chakra-ui/react';
import { FC } from 'react';

export const StackLayout: FC<StackProps> = (props) => {
  const { children } = props;
  return <Stack {...props}>{children}</Stack>;
};

export const HStackLayout: FC<typeof HStack> = (props) => {
  const { children } = props;
  return <HStack {...props}>{children}</HStack>;
};

export const VStackLayout: FC<typeof VStack> = (props) => {
  const { children } = props;
  return <VStack {...props}>{children}</VStack>;
};
