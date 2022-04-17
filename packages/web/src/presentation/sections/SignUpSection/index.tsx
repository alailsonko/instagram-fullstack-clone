import { config } from 'config/config';
import {
  signUpMutation,
  signUpMutationVariables
} from 'domain/models/graphql/auth/mutation/signup';
import { graphqlRequestBody } from 'domain/protocols/request/graphqlRequestBody';
import { HTTP_METHODS_ENUM } from 'domain/protocols/request/httpMethodsEnum';
import { SignUpFormProps, SignUpResponse, SubmitSignUpHandler } from 'domain/usecases/signup';
import { BoxLayout } from 'infra/components/Layout/Box';
import { VStackLayout } from 'infra/components/Layout/Stack';
import { LinkNavigation } from 'infra/components/Navigation/Link';
import { request } from 'infra/services/httpRequest/request';
import InstagramLogoBlock from 'presentation/blocks/InstagramLogoBlock';
import SignUpFormBlock from 'presentation/blocks/SignUpFormBlock';
import { useMutation } from 'react-query';

const SignUpSection = () => {
  const signUpMutationResponse = useMutation(async (data: SignUpFormProps) => {
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
  });
  const handleSignUpSubmit: SubmitSignUpHandler = async (data) => {
    const response = await signUpMutationResponse.mutateAsync(data);
    console.log('response', response);
    console.log('response', {
      isLoading: signUpMutationResponse.isLoading,
      isSuccess: signUpMutationResponse.isSuccess,
      dataMutation: signUpMutationResponse.data,
      isError: signUpMutationResponse.isError
    });
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
        <SignUpFormBlock onSubmit={handleSignUpSubmit} />
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
          to="/"
          style={{
            justifyContent: 'center'
          }}>
          Sign In
        </LinkNavigation>
      </BoxLayout>
    </VStackLayout>
  );
};

export default SignUpSection;
