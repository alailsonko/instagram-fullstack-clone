import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

const BoxLayout: FC<BoxProps> = (props) => {
  const { children } = props;
  return <Box {...props}>{children}</Box>;
};

export default BoxLayout;
