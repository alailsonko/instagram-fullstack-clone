import React, { CSSProperties, FC } from 'react';
import { ReactComponent as IntagramLogoNavBar } from 'presentation/assets/instragram-logo-navbar.svg';
import Input from 'infra/components/Forms/Input/ControllableInputs';
import { Avatar, Icon } from '@chakra-ui/react';
import { AiFillHome, AiOutlinePlusSquare, AiOutlineHeart } from 'react-icons/ai';
import { BsCursor, BsGeo } from 'react-icons/bs';
import { Btn } from 'infra/components/Forms/Button';
import { HStackLayout } from 'infra/components/Layout/Stack';
import { BoxLayout } from 'infra/components/Layout/Box';

interface Props {
  handleOnClickHomeBtn?: Function;
  handleOnClickInboxBtn?: Function;
  handleOnClickCreatePostBtn: () => any;
  handleOnClickExplorerBtn?: Function;
  handleOnClickNotificationsBtn?: Function;
}

const NavigationBlock: FC<Props> = (props) => {
  const { handleOnClickCreatePostBtn } = props;

  const commonStyle: CSSProperties = {
    padding: '0',
    borderRadius: '50%'
  };

  const stylesInput: CSSProperties = {
    borderRadius: '0px'
  };

  const stylesBtnIcon: CSSProperties = {
    ...commonStyle,
    marginRight: '2.5pt'
  };

  return (
    <HStackLayout marginTop="2.5" justifyContent="space-between" className="navbar-container">
      <BoxLayout>
        <IntagramLogoNavBar />
      </BoxLayout>
      <BoxLayout>
        <Input
          id="text"
          placeholder="Search"
          field="text"
          size="sm"
          w="3xs"
          variant="filled"
          style={stylesInput}
        />
      </BoxLayout>
      <BoxLayout>
        <Btn style={stylesBtnIcon}>
          <Icon w="6" h="6" as={AiFillHome} />
        </Btn>
        <Btn style={stylesBtnIcon}>
          <Icon w="6" h="6" as={BsCursor} />
        </Btn>
        <Btn onClick={handleOnClickCreatePostBtn} style={stylesBtnIcon}>
          <Icon w="6" h="6" as={AiOutlinePlusSquare} />
        </Btn>
        <Btn style={stylesBtnIcon}>
          <Icon w="6" h="6" as={BsGeo} />
        </Btn>
        <Btn style={stylesBtnIcon}>
          <Icon w="6" h="6" as={AiOutlineHeart} />
        </Btn>
        <Btn style={commonStyle}>
          <Avatar src="https://bit.ly/broken-link" />
        </Btn>
      </BoxLayout>
    </HStackLayout>
  );
};

export default NavigationBlock;
