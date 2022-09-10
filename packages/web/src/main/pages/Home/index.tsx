import React from 'react';
import HomeLayout from 'presentation/layout/HomeLayout';
import NavigationSection from 'presentation/sections/NavigationSection';
import PostsTimelineSection from 'presentation/sections/PostsTimelineSection';

const Home = () => {
  return (
    <HomeLayout maxW="container.xl">
      <NavigationSection />
      <PostsTimelineSection />
    </HomeLayout>
  );
};

export default Home;
