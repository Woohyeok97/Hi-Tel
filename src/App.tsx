import './tailwind.css'
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// components
import Router from "Router";
import Layout from "components/layout/Layout";
import Loader from 'components/UI/Loader';

const queryClient = new QueryClient()



function App() {
    const { user, init } = useContext(AuthContext)
  
    return (
        <RecoilRoot> 
            <QueryClientProvider client={ queryClient }>
                <Layout>
                { init && <Router isAuthentication={ !!user }/> }
                </Layout>
                {/* <ReactQueryDevtools/> */}
            </QueryClientProvider>
        </RecoilRoot>
    );
}

export default App;
