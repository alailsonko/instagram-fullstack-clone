import React from 'react';
import NavigationSection from 'presentation/sections/NavigationSection';
import ProfileLayout from 'presentation/layout/ProfileLayout';
import ProfileDetailSection from 'presentation/sections/ProfileDetailSection';

const Profile = () => {
  return (
    <ProfileLayout maxW="container.xl">
      <NavigationSection />
      <ProfileDetailSection />
    </ProfileLayout>
  );
};

export default Profile;
