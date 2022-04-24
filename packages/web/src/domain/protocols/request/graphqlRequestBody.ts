export type GraphqlRequestBodyType<T> = {
  query: string;
  variables: T;
};

export const graphqlRequestBody = <V extends Object>(
  query: string,
  variables = {} as V
): GraphqlRequestBodyType<V> => ({
  query,
  variables
});
