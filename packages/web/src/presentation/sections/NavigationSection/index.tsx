import { Input, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { Btn } from 'infra/components/Forms/Button';
import {
  ModalBodyContainer,
  ModalContainer,
  ModalContentContainer,
  ModalFooterContainer,
  ModalHeaderContainer,
  ModalOverlayContainer
} from 'infra/components/Modal';
import NavigationBlock from 'presentation/blocks/NavigationBlock';
import { FC, useRef } from 'react';

const NavigationSection: FC = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCreatePostClick = () => {
    onOpen();
  };

  const handleSelectFileFromComputer = () => {
    inputFileRef.current?.click();
  };

  return (
    <>
      <NavigationBlock handleOnClickCreatePostBtn={handleCreatePostClick} />
      <ModalContainer isOpen={isOpen} onClose={onClose}>
        <ModalOverlayContainer />
        <ModalContentContainer>
          <ModalHeaderContainer>Create a Post</ModalHeaderContainer>
          <ModalCloseButton />
          <ModalBodyContainer>
            <Input type="file" ref={inputFileRef} name="file" style={{ display: 'none' }} />
            <Btn onClick={handleSelectFileFromComputer} colorScheme="blue">
              Select from computer
            </Btn>
          </ModalBodyContainer>
          {/* <ModalFooterContainer>
            <Btn>Secondary Action</Btn>
            <Btn colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Btn>
          </ModalFooterContainer> */}
        </ModalContentContainer>
      </ModalContainer>
    </>
  );
};

export default NavigationSection;
