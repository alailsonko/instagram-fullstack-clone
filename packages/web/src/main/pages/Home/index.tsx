import React from 'react';
import HomeLayout from 'presentation/layout/HomeLayout';
import NavigationSection from 'presentation/sections/NavigationSection';

const Home = () => {
  return (
    <HomeLayout maxW="container.xl">
      <NavigationSection />
    </HomeLayout>
  );
};

export default Home;
