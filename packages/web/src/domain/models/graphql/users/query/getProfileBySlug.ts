export const getProfileBySlugQuery = `query GetProfileBySlug($username: String) {
    getProfileBySlug(username: $username) {
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
  }
`;

export type GetProfileBySlugVariablesType = {
  username: string;
};

export const getProfileBySlugQueryVariables = ({
  username
}: GetProfileBySlugVariablesType): GetProfileBySlugVariablesType => ({ username });
