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
import Layout from "components/layout/Layout";
import Loader from 'components/UI/Loader';


const queryClient = new QueryClient();

function App() {
  const { user, init } = useContext(AuthContext);

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
