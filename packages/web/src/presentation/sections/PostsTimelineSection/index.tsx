/* eslint-disable react/jsx-no-useless-fragment */
import { Image, Text } from '@chakra-ui/react';
import { BoxLayout } from 'infra/components/Layout/Box';
import { VStackLayout } from 'infra/components/Layout/Stack';
import { CSSProperties, FC, useEffect } from 'react';
import graphql from 'babel-plugin-relay/macro';
import { useQueryLoader, usePreloadedQuery, PreloadedQuery } from 'react-relay';
import type { PostsTimelineSectionQuery } from './__generated__/PostsTimelineSectionQuery.graphql';

const GET_ALL_POSTS = graphql`
  query PostsTimelineSectionQuery($after: String, $first: Int, $before: String, $last: Int) {
    posts(after: $after, first: $first, before: $before, last: $last) {
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
  initialQueryRef: PreloadedQuery<PostsTimelineSectionQuery>;
};

const PostsList: FC<Props> = (props) => {
  const { initialQueryRef } = props;
  const cardPostCss: CSSProperties = {
    borderStyle: 'solid',
    borderWidth: '1pt',
    borderRadius: '2%'
  };
  const cardImageCss: CSSProperties = {
    borderStyle: 'solid',
    borderWidth: '1pt'
  };
  const data = usePreloadedQuery<PostsTimelineSectionQuery>(GET_ALL_POSTS, initialQueryRef);

  return (
    <>
      {data.posts.edges?.map((item, index) => (
        <VStackLayout w="xl" key={`${item?.node?.id}`} style={cardPostCss}>
          <BoxLayout padding="2" alignSelf="flex-start">
            <Text>{item?.node?.user?.username}</Text>
          </BoxLayout>
          <BoxLayout style={cardImageCss}>
            <Image
              w="xl"
              h="2xl"
              loading="lazy"
              src={`${process.env.REACT_APP_STATIC_FILES_URL}/static/${item?.node?.medias[0]?.url}`}
              alt={`${item?.node?.description}`}
            />
          </BoxLayout>
          <BoxLayout padding="2" alignSelf="flex-start">
            <Text>
              {item?.node?.user?.username} {item?.node?.description}
            </Text>
          </BoxLayout>
        </VStackLayout>
      ))}
    </>
  );
};

const PostsTimelineSection: FC = () => {
  const [getAllPostsQueryReference, getAllPostsLoadQuery] =
    useQueryLoader<PostsTimelineSectionQuery>(GET_ALL_POSTS);

  useEffect(() => {
    getAllPostsLoadQuery({});
  }, []);

  return (
    <VStackLayout>
      {getAllPostsQueryReference && <PostsList initialQueryRef={getAllPostsQueryReference} />}
    </VStackLayout>
  );
};

export default PostsTimelineSection;
