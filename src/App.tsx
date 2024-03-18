import './tailwind.css'
import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import globalStyles from 'styles/globalStyles';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// components
import { Global } from '@emotion/react';
import Router from "Router";
import Loader from 'components/UI/Loader';
import { Layout } from 'components/shared/Layout';

function App() {
  const { user, init } = useContext(AuthContext);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <>
    <Global styles={globalStyles} />
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <Layout>
        {init && <Router isAuthentication={!!user} /> }
        </Layout>
        <ReactQueryDevtools/>
      </RecoilRoot>
    </QueryClientProvider>
    </>
  );
}

export default App;
