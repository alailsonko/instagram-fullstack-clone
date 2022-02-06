import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <div>hello</div>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
