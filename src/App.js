import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import { Redirect } from 'react-router'
// import { Router, Route, Switch } from "react-router";
import { useEffect } from "react";
import Menu from "./Components/Menu";
import Portfolio from "./Components/Portfolio.js";
import Feedback from "./Components/Feedback.js";
import Wallet from "./Components/Wallet.js";
import Header from "./Components/Header.js";
// import Brand from "./Components/Brand";
// import Error from "./Components/Error";
import { useMoralis } from "react-moralis";
import {connect,useSelector,useDispatch} from 'react-redux'
import logo from './logo.svg';
import './App.css';
import './style.css'

function App() {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();
  const  wallet  =  useSelector(state  =>  state.walletAddress);
  useEffect(() => {
    console.log('APPPPPP',wallet)
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);
  return (
    <div className="App">
      <Router>
        <div className="d-flex">
          <Menu />
          <div className="board">
            <Header/>
            <Routes>
            <Route exact path="/" element={<Wallet/>}/>
              <Route key={3} path="/wallet" element={<Wallet/>}/>
              <Route key={1} path="/portfolio/:id" element={<Portfolio/>}/>
              <Route key={2} path="/feedback" element={<Feedback/>}/>
              
            </Routes>
          </div>
        </div>
      </Router> 
    </div>
  );
}
const mapStateToProps = state => ({
  portfolio_data: state.counterApp,
  wallet_address: state.walletAddress
})

//connect function INJECTS dispatch function as a prop!!
export default connect(mapStateToProps)(App);
// export default App;
