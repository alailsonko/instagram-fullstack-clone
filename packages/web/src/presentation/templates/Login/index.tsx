import { SubmitLoginHandler } from 'domain/usecases/login';
import LoginForm from 'presentation/sections/LoginForm';
import LoginBanner from 'presentation/sections/LoginBanner';

const Login = () => {
  const handleLoginSubmit: SubmitLoginHandler = (data) => {
    console.log('data', data);
  };
  return (
    <div>
      <LoginBanner />
      <LoginForm onSubmit={handleLoginSubmit} />
    </div>
  );
};

export default Login;
