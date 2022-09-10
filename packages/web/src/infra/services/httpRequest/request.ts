/* eslint-disable no-restricted-syntax */
import { config } from 'config/config';
import { graphqlRequestBody } from 'domain/protocols/request/graphqlRequestBody';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { authPersist } from 'infra/auth/jwt';

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

async function fetchRelayr(params: any, variables: any): Promise<any> {
  console.log(`fetching query ${params.name} with ${JSON.stringify(variables)}`);
  const body = graphqlRequestBody(params.text, variables);

  return request(config.GRAPHQL_ENDPOINT, 'POST', body);
}

function fetchQuery(operation: any, variables: any, cacheConfig: any, uploadables: any) {
  const getToken = JSON.parse(localStorage.getItem('token') || '');
  console.log('getToken', getToken);

  const requestT: any = {
    method: 'POST',
    headers: {
      Authorization: `bearer ${getToken.auth.data.register.token}`
    }
  };

  if (uploadables) {
    if (!window.FormData) {
      throw new Error('Uploading files without `FormData` not supported.');
    }
    console.log('operation', operation);
    console.log('variables', variables);
    console.log('uploadables', uploadables);
    const formData = new FormData();
    formData.append('operations', JSON.stringify([{ query: operation.text, variables }]));
    formData.append('map', JSON.stringify({ 0: ['0.variables.input.file.0'] }));

    Object.keys(uploadables).forEach((key, index) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        formData.append(index.toString(), uploadables[key][index]);
        console.log('key', key, 'uploadables', uploadables[key][index]);
      }
    });

    requestT.body = formData;
  } else {
    requestT.headers['Content-Type'] = 'application/json';
    requestT.body = JSON.stringify({
      query: operation.text,
      variables
    });
  }

  return fetch(config.GRAPHQL_ENDPOINT, requestT)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }

      // HTTP errors
      // TODO: NOT sure what to do here yet
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
