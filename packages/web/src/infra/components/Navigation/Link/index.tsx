import { Link, LinkProps } from '@chakra-ui/react';
import { FC } from 'react';

export const LinkNavigation: FC<LinkProps> = (props) => {
  const { children } = props;
  return <Link {...props}> {children} </Link>;
};
