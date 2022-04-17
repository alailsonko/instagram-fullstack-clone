import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import RoutesApp from 'main/routes';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <RoutesApp />
        </QueryClientProvider>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
