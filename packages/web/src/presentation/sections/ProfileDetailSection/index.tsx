/* eslint-disable react/jsx-no-useless-fragment */
import React, { FC, useCallback, useEffect, useState } from 'react';
import { HStackLayout, VStackLayout } from 'infra/components/Layout/Stack';
import { BoxLayout } from 'infra/components/Layout/Box';
import {
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react';
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
import { Object } from 'ts-toolbelt';
import {
  ProfileDetailSectionQuery,
  ProfileDetailSectionQuery$data
} from './__generated__/ProfileDetailSectionQuery.graphql';

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
type PostDataType = Object.Path<ProfileDetailSectionQuery$data, ['getPostsBySlug', 'edges', '0']>;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleGetNextPost: () => void;
  handleGetPreviousPost: () => void;
  postData: PostDataType;
  postIndex: number;
  postsDataLen: number;
}

const VerticallyCenterModal: FC<ModalProps> = (props) => {
  const {
    isOpen,
    onClose,
    postData,
    handleGetNextPost,
    handleGetPreviousPost,
    postIndex,
    postsDataLen
  } = props;
  if (!postData) {
    return <></>;
  }
  return (
    <Modal size="6xl" onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay>
        <ModalContent position="relative" display="flex" flexDirection="row" alignItems="center">
          {postIndex !== 0 && (
            <Btn onClick={handleGetPreviousPost} right="100%" position="absolute">
              Previous
            </Btn>
          )}

          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="row">
            <ModalCloseButton />
            <Image
              w="2xl"
              h="2xl"
              src={`${process.env.REACT_APP_STATIC_FILES_URL}/static/${postData?.node?.medias[0]?.url}`}
            />
            <BoxLayout>
              <Text>{postData.node?.user?.username}</Text>
              <Text>{postData.node?.description}</Text>
            </BoxLayout>
          </ModalBody>
          {postIndex !== postsDataLen - 1 && (
            <Btn onClick={handleGetNextPost} left="100%" position="absolute">
              Next
            </Btn>
          )}
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

const ProfilePostsList: FC<Props> = (props) => {
  const { initialQueryRef } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const data = usePreloadedQuery<ProfileDetailSectionQuery>(GET_POSTS_BY_SLUG, initialQueryRef);
  const [postData, setPostData] = useState<PostDataType>(null);
  const [postIndex, setPostIndex] = useState<number>(0);
  const [postsDataLen, setPostsDataLen] = useState<number>(0);

  const handleGetPreviousPost = () => {
    console.log('previous');
    setPostIndex((prevState) => prevState - 1);
  };

  const handleGetNextPost = () => {
    console.log('next');
    setPostIndex((prevState) => prevState + 1);
  };

  useEffect(() => {
    if (!data.getPostsBySlug.edges) {
      return;
    }
    setPostsDataLen(data.getPostsBySlug.edges.length);
    setPostData(data.getPostsBySlug.edges[postIndex]);
  }, [postIndex]);

  const handleSelectPostDetail = useCallback((item: PostDataType, index: number) => {
    if (!data.getPostsBySlug.edges) {
      return;
    }
    setPostIndex(index);
    setPostData(data.getPostsBySlug.edges[index]);

    if (!isOpen) {
      onOpen();
    }
  }, []);

  return (
    <Grid templateColumns="repeat(1, 1fr 1fr 1fr)">
      {data.getPostsBySlug.edges?.map((item, index) => (
        <GridItem
          key={item?.node?.id}
          onClick={() => handleSelectPostDetail(item, index)}
          cursor="pointer"
          padding="2">
          <Image
            src={`${process.env.REACT_APP_STATIC_FILES_URL}/static/${item?.node?.medias[0]?.url}`}
          />
        </GridItem>
      ))}
      <VerticallyCenterModal
        handleGetPreviousPost={handleGetPreviousPost}
        handleGetNextPost={handleGetNextPost}
        postIndex={postIndex}
        postsDataLen={postsDataLen}
        postData={postData}
        isOpen={isOpen}
        onClose={onClose}
      />
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
    getPostsBySlugLoadQuery({
      username: slug
    });
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
