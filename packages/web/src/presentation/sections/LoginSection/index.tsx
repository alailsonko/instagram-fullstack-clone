import LoginFormBlock from 'presentation/blocks/LoginFormBlock';
import { LoginFormProps, SubmitLoginHandler } from 'domain/usecases/login';
import { BoxLayout } from 'infra/components/Layout/Box';
import { HStackLayout, VStackLayout } from 'infra/components/Layout/Stack';
import { CSSProperties, useEffect } from 'react';
import { LinkNavigation } from 'infra/components/Navigation/Link';
import InstagramLogoBlock from 'presentation/blocks/InstagramLogoBlock';
import { SignUpResponse } from 'domain/usecases/signup';
import { graphqlRequestBody } from 'domain/protocols/request/graphqlRequestBody';
import {
  signInQuery,
  signInQueryVariables,
  SignInQueryVariablesType
} from 'domain/models/graphql/auth/query/signin';
import { useFetchQuery } from 'infra/hooks/useFetchQuery';

const LoginSection = () => {
  const {
    data: dataSignInResponse,
    isLoading,
    dispatchFetch,
    isSuccessful
  } = useFetchQuery<SignInQueryVariablesType, SignUpResponse>();

  function handleBodyGraphql(data: LoginFormProps) {
    return graphqlRequestBody(
      signInQuery,
      signInQueryVariables({
        loginEmail: data.email,
        loginPassword: data.password
      })
    );
  }
  const handleLoginSubmit: SubmitLoginHandler = async (data) => {
    const body = handleBodyGraphql(data);
    await dispatchFetch(body);
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
