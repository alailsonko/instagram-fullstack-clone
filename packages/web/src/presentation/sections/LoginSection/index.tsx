import LoginFormBlock from 'presentation/blocks/LoginFormBlock';
import { SubmitLoginHandler } from 'domain/usecases/login';
import { BoxLayout } from 'infra/components/Layout/Box';
import { HStackLayout, VStackLayout } from 'infra/components/Layout/Stack';
import { CSSProperties } from 'react';
import { LinkNavigation } from 'infra/components/Navigation/Link';
import InstagramLogoBlock from 'presentation/blocks/InstagramLogoBlock';

const LoginSection = () => {
  const handleLoginSubmit: SubmitLoginHandler = (data) => {
    console.log('data', data);
  };
  const barStyle: CSSProperties = {
    marginTop: '1rem',
    marginBottom: '1rem',
    borderWidth: '1px',
    width: '11.5em'
  };
  return (
    <VStackLayout>
      <BoxLayout
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={8}
        borderWidth={1}
        width="30rem"
        height="25rem">
        <InstagramLogoBlock />
        <LoginFormBlock onSubmit={handleLoginSubmit} />
        <HStackLayout>
          <div style={barStyle} />
          <span>or</span>
          <div style={barStyle} />
        </HStackLayout>
        <LinkNavigation
          to="/forgot-password"
          style={{
            justifyContent: 'center'
          }}>
          Forgot password?
        </LinkNavigation>
      </BoxLayout>
      <BoxLayout
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
        borderWidth={1}
        width="30rem"
        height="4rem">
        <LinkNavigation
          to="/accounts/emailsignup"
          style={{
            justifyContent: 'center'
          }}>
          Sign up
        </LinkNavigation>
      </BoxLayout>
    </VStackLayout>
  );
};

export default LoginSection;
