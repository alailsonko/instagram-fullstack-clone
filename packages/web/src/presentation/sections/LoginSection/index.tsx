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
import { useToast } from '@chakra-ui/react';
import { SpinnerFeedback } from 'infra/components/Feedback/Spinner';

const LoginSection = () => {
  const toast = useToast();

  const {
    data: dataSignInResponse,
    isLoading,
    dispatchFetch,
    isSuccess,
    isError
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
    console.log(dataSignInResponse);
  };
  const barStyle: CSSProperties = {
    marginTop: '1rem',
    marginBottom: '1rem',
    borderWidth: '1px',
    width: '11.5em'
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Account logged.',
        description: "We're redirecting you.",
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    }
    if (isError) {
      toast({
        title: 'Error while making login.',
        description: 'Please try again again.',
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    }
  }, [isSuccess, isError]);

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
        {isLoading || isSuccess ? (
          <SpinnerFeedback
            alignSelf="center"
            marginTop="30%"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <>
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
          </>
        )}
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
