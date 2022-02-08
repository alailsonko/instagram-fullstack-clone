import { HStackLayout } from 'infra/components/Layout/Stack';
import LoginBannerBlock from 'presentation/blocks/LoginBannerBlock';
import LoginSection from 'presentation/sections/LoginSection';

const Login = () => {
  return (
    <HStackLayout>
      <LoginBannerBlock />
      <LoginSection />
    </HStackLayout>
  );
};

export default Login;
