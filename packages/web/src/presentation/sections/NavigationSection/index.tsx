import {
  Image,
  Input,
  ModalCloseButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useDisclosure
} from '@chakra-ui/react';
import { Btn } from 'infra/components/Forms/Button';
import { BoxLayout } from 'infra/components/Layout/Box';
import { HStackLayout, VStackLayout } from 'infra/components/Layout/Stack';
import {
  ModalBodyContainer,
  ModalContainer,
  ModalContentContainer,
  ModalHeaderContainer,
  ModalOverlayContainer
} from 'infra/components/Modal';
import NavigationBlock from 'presentation/blocks/NavigationBlock';
import { FC, useEffect, useRef, useState } from 'react';

const NavigationSection: FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const inputDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const imgPreviewFileRef = useRef<HTMLImageElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCreatePostClick = () => {
    onOpen();
  };

  useEffect(() => {
    if (!isOpen) {
      setTabIndex(0);
    }
  }, [isOpen]);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const handleSelectFileFromComputer = () => {
    inputFileRef.current?.click();
  };

  const handleChangeFile = (e: any) => {
    if (imgPreviewFileRef.current) {
      imgPreviewFileRef.current.src = URL.createObjectURL(e.target.files[0]);
      setTabIndex(1);
    }
  };

  const handlePublishBtn = () => {
    if (inputDescriptionRef.current && inputFileRef.current) {
      console.log('inputDescriptionRef.current', inputDescriptionRef.current.value);
      console.log('inputFileRef.current.files', inputFileRef.current.files);
    }
  };

  return (
    <>
      <NavigationBlock handleOnClickCreatePostBtn={handleCreatePostClick} />
      <ModalContainer size="4xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlayContainer />
        <ModalContentContainer>
          <Tabs index={tabIndex} onChange={handleTabsChange}>
            <TabPanels>
              <TabPanel>
                <HStackLayout justifyContent="space-between">
                  <ModalHeaderContainer flex={1}>Create a Post</ModalHeaderContainer>
                  <ModalCloseButton />
                </HStackLayout>
                <ModalBodyContainer>
                  <Input
                    onChange={handleChangeFile}
                    type="file"
                    ref={inputFileRef}
                    name="file"
                    style={{ display: 'none' }}
                  />
                  <Btn onClick={handleSelectFileFromComputer} colorScheme="blue">
                    Select from computer
                  </Btn>
                </ModalBodyContainer>
              </TabPanel>
              <TabPanel>
                <HStackLayout justifyContent="space-between">
                  <ModalHeaderContainer flex={1}>Create a Post</ModalHeaderContainer>
                  <Btn onClick={handlePublishBtn} colorScheme="blue">
                    Publish
                  </Btn>
                </HStackLayout>
                <ModalBodyContainer>
                  <HStackLayout alignItems="start">
                    <BoxLayout>
                      <Image ref={imgPreviewFileRef} src="" alt="" />
                    </BoxLayout>
                    <BoxLayout>
                      <VStackLayout>
                        <BoxLayout>
                          <Textarea
                            ref={inputDescriptionRef}
                            placeholder="Write a description..."
                          />
                        </BoxLayout>
                      </VStackLayout>
                    </BoxLayout>
                  </HStackLayout>
                </ModalBodyContainer>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContentContainer>
      </ModalContainer>
    </>
  );
};

export default NavigationSection;
