export const signUpMutation = `mutation signUp($email: String!, $password: String!, $passwordConfirm: String!, $username: String!) {
  register(email: $email, password: $password, passwordConfirm: $passwordConfirm, username: $username) {
    token
    user {
      id
      username
      email
      createdAt
      updatedAt
      uuid
    }
  }
}`;

type signUpMutationVariablesType = {
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
};

export const signUpMutationVariables = ({
  password,
  passwordConfirm,
  username,
  email
}: signUpMutationVariablesType): signUpMutationVariablesType => ({
  email,
  password,
  passwordConfirm,
  username
});
