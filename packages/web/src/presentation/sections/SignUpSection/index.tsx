import { SubmitLoginHandler } from 'domain/usecases/login';
import { BoxLayout } from 'infra/components/Layout/Box';
import { VStackLayout } from 'infra/components/Layout/Stack';
import { LinkNavigation } from 'infra/components/Navigation/Link';
import InstagramLogoBlock from 'presentation/blocks/InstagramLogoBlock';
import SignUpFormBlock from 'presentation/blocks/SignUpFormBlock';

const SignUpSection = () => {
  const handleLoginSubmit: SubmitLoginHandler = (data) => {
    console.log('data', data);
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
        <SignUpFormBlock onSubmit={handleLoginSubmit} />
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
