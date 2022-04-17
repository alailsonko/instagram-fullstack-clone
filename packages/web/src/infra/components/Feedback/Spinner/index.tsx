import { Spinner, SpinnerProps } from '@chakra-ui/react';
import { FC } from 'react';

export const SpinnerFeedback: FC<SpinnerProps> = (props) => {
  return <Spinner {...props} />;
};
