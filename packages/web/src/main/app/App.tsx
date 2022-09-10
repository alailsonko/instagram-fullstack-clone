import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import RoutesApp from 'main/routes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RelayEnvironmentProvider } from 'react-relay';
import Environment from 'infra/services/httpRequest/request';

const queryClient = new QueryClient();

function App() {
  return (
    <RelayEnvironmentProvider environment={Environment}>
      <RecoilRoot>
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
            <RoutesApp />
          </QueryClientProvider>
        </ChakraProvider>
      </RecoilRoot>
    </RelayEnvironmentProvider>
  );
}

export default App;
