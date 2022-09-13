import React, { useEffect } from 'react';
import { HStackLayout, VStackLayout } from 'infra/components/Layout/Stack';
import { BoxLayout } from 'infra/components/Layout/Box';
import { Avatar, Flex, Grid, Text } from '@chakra-ui/react';
import { Btn } from 'infra/components/Forms/Button';
import { useFetchQuery } from 'infra/hooks/useFetchQuery';
import { GetProfileBySlugResponse } from 'domain/usecases/getProfileBySlug';
import {
  getProfileBySlugQuery,
  getProfileBySlugQueryVariables,
  GetProfileBySlugVariablesType
} from 'domain/models/graphql/users/query/getProfileBySlug';
import { useParams } from 'react-router-dom';

const ProfileDetailSection = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: dataGetProfileBySlugResponse,
    isLoading,
    dispatchFetch,
    isSuccess,
    isError
  } = useFetchQuery<GetProfileBySlugVariablesType, GetProfileBySlugResponse>();
  useEffect(() => {
    if (slug) {
      dispatchFetch({
        query: getProfileBySlugQuery,
        variables: getProfileBySlugQueryVariables({
          username: slug
        })
      });
    }
  }, []);
  return (
    <BoxLayout>
      <Grid templateColumns="repeat(1, 0.7fr 1fr)">
        <Flex justifyContent="center">
          <Avatar
            size="4xl"
            src={
              dataGetProfileBySlugResponse?.data.getProfileBySlug.avatarId
                ? dataGetProfileBySlugResponse?.data.getProfileBySlug?.avatar?.url
                : 'https://bit.ly/broken-link'
            }
          />
        </Flex>
        <VStackLayout justifyContent="space-around" alignItems="flex-start">
          <HStackLayout>
            <BoxLayout>
              <Text>{dataGetProfileBySlugResponse?.data.getProfileBySlug.username}</Text>
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
  );
};

export default ProfileDetailSection;
