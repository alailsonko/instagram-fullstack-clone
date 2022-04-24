import { Container, ContainerProps } from '@chakra-ui/react';
import { FC } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.5
    }
  },
  exit: {
    x: '-100vh',
    transition: {
      ease: 'easeInOut'
    }
  }
};

export const ContainerLayout: FC<ContainerProps> = (props) => {
  const { children } = props;
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <Container {...props}>{children}</Container>
    </motion.div>
  );
};
