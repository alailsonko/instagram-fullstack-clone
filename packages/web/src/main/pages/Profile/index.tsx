import React from 'react';
import NavigationSection from 'presentation/sections/NavigationSection';
import ProfileLayout from 'presentation/layout/ProfileLayout';
import { HStackLayout, VStackLayout } from 'infra/components/Layout/Stack';
import { BoxLayout } from 'infra/components/Layout/Box';
import { Avatar, Flex, Grid, Text } from '@chakra-ui/react';
import { Btn } from 'infra/components/Forms/Button';

const Profile = () => {
  return (
    <ProfileLayout maxW="container.xl">
      <NavigationSection />
      <BoxLayout>
        <Grid templateColumns="repeat(1, 0.7fr 1fr)">
          <Flex justifyContent="center">
            <Avatar size="4xl" src="https://bit.ly/broken-link" />
          </Flex>
          <VStackLayout justifyContent="space-around" alignItems="flex-start">
            <HStackLayout>
              <BoxLayout>
                <Text>hce_h</Text>
              </BoxLayout>
              <BoxLayout>
                <Btn>Edit profile</Btn>
              </BoxLayout>
              <BoxLayout>
                <Btn>Config</Btn>
              </BoxLayout>
            </HStackLayout>
            <HStackLayout>
              <BoxLayout>
                <Text>9 posts</Text>
              </BoxLayout>
              <BoxLayout>
                <Text>490 followers</Text>
              </BoxLayout>
              <BoxLayout>
                <Text>7,333 following</Text>
              </BoxLayout>
            </HStackLayout>
            <HStackLayout>
              <BoxLayout>
                <Text>A.A</Text>
              </BoxLayout>
            </HStackLayout>
          </VStackLayout>
        </Grid>
      </BoxLayout>
    </ProfileLayout>
  );
};

export default Profile;
