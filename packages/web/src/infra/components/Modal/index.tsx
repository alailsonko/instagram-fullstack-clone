import {
  Modal,
  ModalProps,
  ModalOverlay,
  ModalOverlayProps,
  ModalContent,
  ModalContentProps,
  ModalHeader,
  ModalHeaderProps,
  ModalFooter,
  ModalFooterProps,
  ModalBody,
  ModalBodyProps
  //   ModalCloseButton,
  //   ComponentWithAs,
  //   CloseButtonProps
} from '@chakra-ui/react';
import { FC } from 'react';

export const ModalContainer: FC<ModalProps> = (props) => {
  const { children } = props;
  return <Modal {...props}>{children}</Modal>;
};

export const ModalOverlayContainer: FC<ModalOverlayProps> = (props) => {
  const { children } = props;
  return <ModalOverlay {...props}>{children}</ModalOverlay>;
};

export const ModalContentContainer: FC<ModalContentProps> = (props) => {
  const { children } = props;
  return <ModalContent {...props}>{children}</ModalContent>;
};

export const ModalHeaderContainer: FC<ModalHeaderProps> = (props) => {
  const { children } = props;
  return <ModalHeader {...props}>{children}</ModalHeader>;
};

export const ModalFooterContainer: FC<ModalFooterProps> = (props) => {
  const { children } = props;
  return <ModalFooter {...props}>{children}</ModalFooter>;
};

export const ModalBodyContainer: FC<ModalBodyProps> = (props) => {
  const { children } = props;
  return <ModalBody {...props}>{children}</ModalBody>;
};

// export const ModalCloseButtonContainer: FC<ComponentWithAs<'button', CloseButtonProps>> = (
//   props
// ) => {
//   const { children } = props;
//   return <ModalCloseButton {...props}>{children}</ModalCloseButton>;
// };
