import { useContext } from "react";
import AuthContext from "context/AuthContext";
// components
import Router from "Router";
import Layout from "components/layout/Layout";


function App() {
    const { user, init } = useContext(AuthContext)
  
    return (
        <Layout>
        { init ? <Router isAuthentication={ !!user }/> : '하이텔' }
        </Layout>
    );
}

export default App;
