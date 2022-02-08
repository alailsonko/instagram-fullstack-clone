import { SimpleGrid, SimpleGridProps } from '@chakra-ui/react';
import { FC } from 'react';

export const SimpleGridLayout: FC<SimpleGridProps> = (props) => {
  const { children } = props;
  return <SimpleGrid {...props}>{children}</SimpleGrid>;
};
