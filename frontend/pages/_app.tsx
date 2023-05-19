import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const { chains, provider } = configureChains(
    [goerli],
    [
      alchemyProvider({ apiKey: process.env.ALCHEMY_ID || "" }),
      publicProvider(),
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: false,
    connectors,
    provider,
  });

  const goBack = () => {
    router.back();
  };

  return(
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={midnightTheme({})}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}