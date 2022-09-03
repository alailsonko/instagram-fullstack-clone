import LoginLayout from 'presentation/layout/LoginLayout';
import LoginTemplate from 'presentation/templates/LoginTemplate';

export default function Home() {
  return (
    <LoginLayout maxW="8xl" centerContent mt="20">
      <LoginTemplate />
    </LoginLayout>
  );
}
