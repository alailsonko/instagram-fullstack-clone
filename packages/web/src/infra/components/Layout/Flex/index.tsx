import { Flex, FlexProps, Spacer, SpacerProps } from '@chakra-ui/react';
import { FC } from 'react';

export const FlexLayout: FC<FlexProps> = (props) => {
  const { children } = props;
  return <Flex {...props}>{children}</Flex>;
};

export const SpacerLayout: FC<SpacerProps> = (props) => {
  const { children } = props;
  return <Spacer {...props}>{children}</Spacer>;
};
