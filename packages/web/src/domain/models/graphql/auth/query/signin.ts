export const signInQuery = `query SignIn($loginPassword: String!, $loginEmail: String) {
  login(password: $loginPassword, email: $loginEmail) {
    token
    user {
      idSerial
      username
      email
      createdAt
      updatedAt
      id
    }
  }
}`;

export type SignInQueryVariablesType = {
  loginEmail: string;
  loginPassword: string;
};

export const signInQueryVariables = ({
  loginPassword,
  loginEmail
}: SignInQueryVariablesType): SignInQueryVariablesType => ({
  loginEmail,
  loginPassword
});
