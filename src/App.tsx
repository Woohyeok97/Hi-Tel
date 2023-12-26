import './tailwind.css'
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
// components
import Router from "Router";
import Layout from "components/layout/Layout";
import Loader from 'components/UI/Loader';

// 리액트쿼리 클라이언트
const queryClient = new QueryClient()


function App() {
    const { user, init } = useContext(AuthContext)
  
    return (
        <RecoilRoot> 
            <QueryClientProvider client={ queryClient }>
                <Layout>
                { init ? <Router isAuthentication={ !!user }/> : <Loader/> }
                </Layout>
                <ReactQueryDevtools/>
            </QueryClientProvider>
        </RecoilRoot>
    );
}

export default App;
