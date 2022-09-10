import { Image } from '@chakra-ui/react';
import { BoxLayout } from 'infra/components/Layout/Box';
import { VStackLayout } from 'infra/components/Layout/Stack';
import { CSSProperties } from 'react';

const PostsTimelineSection = () => {
  const Posts = [1, 2, 3, 4, 5, 6, 7];
  const cardPostCss: CSSProperties = {
    borderStyle: 'solid',
    borderWidth: '1pt',
    borderRadius: '2%'
  };
  const cardImageCss: CSSProperties = {
    borderStyle: 'solid',
    borderWidth: '1pt'
  };
  return (
    <VStackLayout>
      {Posts.map(() => (
        <VStackLayout style={cardPostCss}>
          <BoxLayout alignSelf="flex-start">Some description</BoxLayout>
          <BoxLayout style={cardImageCss}>
            <Image
              w="xl"
              h="2xl"
              loading="lazy"
              src="http://localhost:3001/static/1662765127032_Screenshotfrom2022-09-0705-32-17.png"
              alt="something"
            />
          </BoxLayout>
          <BoxLayout alignSelf="flex-start">Some description</BoxLayout>
        </VStackLayout>
      ))}
    </VStackLayout>
  );
};

export default PostsTimelineSection;
