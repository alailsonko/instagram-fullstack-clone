import { Grid, GridItem, GridProps, GridItemProps } from '@chakra-ui/react';
import { FC } from 'react';

export const GridLayout: FC<GridProps> = (props) => {
  const { children } = props;
  return <Grid {...props}>{children}</Grid>;
};

export const GridItemLayout: FC<GridItemProps> = (props) => {
  const { children } = props;
  return <GridItem {...props}>{children}</GridItem>;
};
