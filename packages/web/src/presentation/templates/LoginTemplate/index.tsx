import { HStackLayout } from 'infra/components/Layout/Stack';
import LoginBanner from 'presentation/sections/LoginBanner';
import LoginSection from 'presentation/sections/LoginSection';

const Login = () => {
  return (
    <HStackLayout>
      <LoginBanner />
      <LoginSection />
    </HStackLayout>
  );
};

export default Login;
