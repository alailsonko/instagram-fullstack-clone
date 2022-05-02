import { useToast } from '@chakra-ui/react';
import { config } from 'config/config';
import {
  signUpMutation,
  signUpMutationVariables
} from 'domain/models/graphql/auth/mutation/signup';
import { graphqlRequestBody } from 'domain/protocols/request/graphqlRequestBody';
import { HTTP_METHODS_ENUM } from 'domain/protocols/request/httpMethodsEnum';
import { SignUpFormProps, SignUpResponse, SubmitSignUpHandler } from 'domain/usecases/signup';
import { authPersist } from 'infra/auth/jwt';
import { SpinnerFeedback } from 'infra/components/Feedback/Spinner';
import { BoxLayout } from 'infra/components/Layout/Box';
import { VStackLayout } from 'infra/components/Layout/Stack';
import { LinkNavigation } from 'infra/components/Navigation/Link';
import { request } from 'infra/services/httpRequest/request';
import InstagramLogoBlock from 'presentation/blocks/InstagramLogoBlock';
import SignUpFormBlock from 'presentation/blocks/SignUpFormBlock';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

const SignUpSection = () => {
  const setAuthPersist = useSetRecoilState<{ data: SignUpResponse } | null>(authPersist);

  const toast = useToast();
  const { mutateAsync, isSuccess, isLoading, isError } = useMutation(
    async (data: SignUpFormProps) => {
      return request<SignUpResponse>(
        config.GRAPHQL_ENDPOINT,
        HTTP_METHODS_ENUM.POST,
        graphqlRequestBody(
          signUpMutation,
          signUpMutationVariables({
            email: data.email,
            username: data.username,
            password: data.password,
            passwordConfirm: data.passwordConfirm
          })
        )
      );
    }
  );
  const handleSignUpSubmit: SubmitSignUpHandler = async (data) => {
    return mutateAsync(data)
      .then((response) => {
        setTimeout(() => {
          setAuthPersist({
            data: response.data
          });
        }, 2000);
        return response;
      })
      .catch((error) => error);
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Account created.',
        description: "We're redirecting you.",
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    }
    if (isError) {
      toast({
        title: 'Error while creating account.',
        description: 'Please try again few minutes later.',
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
          <SignUpFormBlock onSubmit={handleSignUpSubmit} />
        )}
      </BoxLayout>
      {!isSuccess && (
        <BoxLayout
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={4}
          borderWidth={1}
          width="30rem"
          height="4rem">
          <LinkNavigation
            to="/"
            style={{
              justifyContent: 'center'
            }}>
            Sign In
          </LinkNavigation>
        </BoxLayout>
      )}
    </VStackLayout>
  );
};

export default SignUpSection;
