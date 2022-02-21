import { Link, LinkProps } from '@chakra-ui/react';
import { Link as ReachLink } from 'react-router-dom';
import { FC } from 'react';

interface Props {
  to: string;
}

export const LinkNavigation: FC<LinkProps & Props> = (props) => {
  const { children, to: toLink } = props;
  return (
    <Link {...props} as={ReachLink} to={toLink}>
      {children}
    </Link>
  );
};
