import React from 'react';
import HomeLayout from 'presentation/layout/HomeLayout';
import NavigationBlock from 'presentation/blocks/NavigationBlock';

const Home = () => {
  return (
    <HomeLayout maxW="container.xl">
      <NavigationBlock />
    </HomeLayout>
  );
};

export default Home;
