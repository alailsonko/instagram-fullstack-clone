import { RecoilRoot } from "recoil";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react"

function MyApp({ Component, pageProps }: AppProps) {
  React.useLayoutEffect = React.useEffect
  return (
    <RecoilRoot>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
