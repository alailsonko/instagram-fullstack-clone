/* eslint-disable no-restricted-syntax */
import { config } from 'config/config';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

export const request = async <T extends Object>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data: Object,
  headers = {}
): Promise<{
  errors: string | undefined;
  data: T;
}> => {
  const response = await fetch(endpoint, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
  return response.json();
};

async function fetchQuery(operation: any, variables: any, cacheConfig: any, uploadables: any) {
  const getToken = JSON.parse(localStorage.getItem('token') || '');

  const requestBuild: any = {
    method: 'POST',
    headers: {
      Authorization: `bearer ${getToken.auth.data.token}`
    }
  };

  if (uploadables) {
    if (!window.FormData) {
      throw new Error('Uploading files without `FormData` not supported.');
    }
    const formData = new FormData();
    formData.append('operations', JSON.stringify([{ query: operation.text, variables }]));
    formData.append('map', JSON.stringify({ 0: ['0.variables.input.file.0'] }));

    Object.keys(uploadables).forEach((key, index) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        formData.append(index.toString(), uploadables[key][index]);
      }
    });

    requestBuild.body = formData;
  } else {
    requestBuild.headers['Content-Type'] = 'application/json';
    requestBuild.body = JSON.stringify({
      query: operation.text,
      variables
    });
  }

  return fetch(config.GRAPHQL_ENDPOINT, requestBuild)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }

      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });
}

export default new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
});
