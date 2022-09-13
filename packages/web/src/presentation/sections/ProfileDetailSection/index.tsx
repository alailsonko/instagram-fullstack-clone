import React, { FC, useEffect } from 'react';
import { HStackLayout, VStackLayout } from 'infra/components/Layout/Stack';
import { BoxLayout } from 'infra/components/Layout/Box';
import { Avatar, Flex, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { Btn } from 'infra/components/Forms/Button';
import { useFetchQuery } from 'infra/hooks/useFetchQuery';
import { GetProfileBySlugResponse } from 'domain/usecases/getProfileBySlug';
import graphql from 'babel-plugin-relay/macro';
import {
  getProfileBySlugQuery,
  getProfileBySlugQueryVariables,
  GetProfileBySlugVariablesType
} from 'domain/models/graphql/users/query/getProfileBySlug';
import { useParams } from 'react-router-dom';
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from 'react-relay';
import { ProfileDetailSectionQuery } from './__generated__/ProfileDetailSectionQuery.graphql';

const GET_POSTS_BY_SLUG = graphql`
  query ProfileDetailSectionQuery(
    $first: Int
    $before: String
    $last: Int
    $username: String
    $after: String
  ) {
    getPostsBySlug(
      first: $first
      before: $before
      last: $last
      username: $username
      after: $after
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          idSerial
          user {
            idSerial
            username
            email
            createdAt
            updatedAt
            avatar {
              idSerial
              url
              postId
              createdAt
              updatedAt
              id
            }
            avatarId
            id
          }
          userId
          description
          medias {
            idSerial
            url
            postId
            createdAt
            updatedAt
            id
          }
          createdAt
          id
          updatedAt
        }
        cursor
      }
    }
  }
`;

type Props = {
  initialQueryRef: PreloadedQuery<ProfileDetailSectionQuery>;
};

const ProfilePostsList: FC<Props> = (props) => {
  const { initialQueryRef } = props;
  const data = usePreloadedQuery<ProfileDetailSectionQuery>(GET_POSTS_BY_SLUG, initialQueryRef);

  return (
    <Grid templateColumns="repeat(1, 1fr 1fr 1fr)">
      {data.getPostsBySlug.edges?.map((item) => (
        <GridItem cursor="pointer" padding="2">
          <Image
            src={`${process.env.REACT_APP_STATIC_FILES_URL}/static/${item?.node?.medias[0]?.url}`}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

const ProfileDetailSection = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: dataGetProfileBySlugResponse,
    isLoading,
    dispatchFetch,
    isSuccess,
    isError
  } = useFetchQuery<GetProfileBySlugVariablesType, GetProfileBySlugResponse>();
  const [getPostsBySlugQueryReference, getPostsBySlugLoadQuery] =
    useQueryLoader<ProfileDetailSectionQuery>(GET_POSTS_BY_SLUG);

  useEffect(() => {
    if (slug) {
      dispatchFetch({
        query: getProfileBySlugQuery,
        variables: getProfileBySlugQueryVariables({
          username: slug
        })
      });
    }
    getPostsBySlugLoadQuery({});
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
      {getPostsBySlugQueryReference && (
        <ProfilePostsList initialQueryRef={getPostsBySlugQueryReference} />
      )}
    </BoxLayout>
  );
};

export default ProfileDetailSection;
