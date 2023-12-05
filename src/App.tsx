import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { RecoilRoot } from "recoil";
// components
import Router from "Router";
import Layout from "components/layout/Layout";


function App() {
    const { user, init } = useContext(AuthContext)
  
    return (
        <RecoilRoot> 
            <Layout>
            { init ? <Router isAuthentication={ !!user }/> : '하이텔' }
            </Layout>
        </RecoilRoot>
    );
}

export default App;
