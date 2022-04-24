import { config } from 'config/config';
import { GraphqlRequestBodyType } from 'domain/protocols/request/graphqlRequestBody';
import { HTTP_METHODS_ENUM } from 'domain/protocols/request/httpMethodsEnum';
import { request } from 'infra/services/httpRequest/request';
import { useState, useTransition } from 'react';

function useFetchQuery<T, R extends object>() {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<{ data: R } | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<object | null>(null);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const dispatchFetch = async (body: GraphqlRequestBodyType<T>) => {
    const response = await request<R>(config.GRAPHQL_ENDPOINT, HTTP_METHODS_ENUM.POST, body)
      .then((responseData) => {
        setIsSuccessful(true);
        return responseData;
      })
      .catch((errorData) => {
        setIsError(true);
        setError(errorData);
        return null;
      });
    startTransition(() => {
      setData(response);
    });
  };
  return {
    isLoading: isPending,
    data,
    dispatchFetch,
    isSuccessful,
    isError,
    error
  };
}

export { useFetchQuery };