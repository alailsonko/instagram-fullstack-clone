import React, { CSSProperties, FC } from 'react';
import { ReactComponent as IntagramLogoNavBar } from 'presentation/assets/instragram-logo-navbar.svg';
import Input from 'infra/components/Forms/Input/ControllableInputs';
import {
  Avatar,
  Button,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Portal,
  Link
} from '@chakra-ui/react';
import { AiFillHome, AiOutlinePlusSquare, AiOutlineHeart } from 'react-icons/ai';
import { BsCursor, BsGeo } from 'react-icons/bs';
import { Btn } from 'infra/components/Forms/Button';
import { HStackLayout } from 'infra/components/Layout/Stack';
import { BoxLayout } from 'infra/components/Layout/Box';
import { useRecoilValue } from 'recoil';
import { authPersist } from 'infra/auth/jwt';
import { Login } from 'domain/usecases/signup';
import { Link as ReactLink } from 'react-router-dom';

interface Props {
  handleOnClickHomeBtn?: Function;
  handleOnClickInboxBtn?: Function;
  handleOnClickCreatePostBtn: () => any;
  handleOnClickExplorerBtn?: Function;
  handleOnClickNotificationsBtn?: Function;
}

const NavigationBlock: FC<Props> = (props) => {
  const { handleOnClickCreatePostBtn } = props;

  const isAuthenticated = useRecoilValue<{ data: Login }>(authPersist);

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
        <Link as={ReactLink} to="/">
          <IntagramLogoNavBar />
        </Link>
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
        <Popover>
          <PopoverTrigger>
            <Avatar w="10" h="10" cursor="pointer" src="https://bit.ly/broken-link" />
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody padding="0" margin="0" display="flex" flexDirection="column">
                <Link
                  w="100%"
                  padding="0"
                  margin="0"
                  as={ReactLink}
                  to={`/${isAuthenticated.data.user.username}`}>
                  <Button w="100%">Profile</Button>
                </Link>
              </PopoverBody>
              <PopoverFooter padding="0" marginTop="1" display="flex" flexDirection="column">
                <Button>Logout</Button>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </BoxLayout>
    </HStackLayout>
  );
};

export default NavigationBlock;
