import { Wrap, WrapItem, WrapProps, WrapItemProps } from '@chakra-ui/react';
import { FC } from 'react';

export const WrapLayout: FC<WrapProps> = (props) => {
  const { children } = props;
  return <Wrap {...props}>{children}</Wrap>;
};

export const WrapItemLayout: FC<WrapItemProps> = (props) => {
  const { children } = props;
  return <WrapItem {...props}>{children}</WrapItem>;
};
