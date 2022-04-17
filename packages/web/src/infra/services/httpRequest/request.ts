export const request = async <T extends Object>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data: Object,
  headers = {}
): Promise<{ data: T }> => {
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
