import HomeLayout from 'presentation/layout/HomeLayout';
import LoginTemplate from 'presentation/templates/LoginTemplate';

export default function Home() {
  return (
    <HomeLayout maxW="8xl" centerContent mt="20">
      <LoginTemplate />
    </HomeLayout>
  );
}
