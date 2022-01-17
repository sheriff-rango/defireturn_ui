import React, { useState,useEffect } from "react";
// import { useDispatch } from 'react-redux'
import {connect,useSelector,useDispatch} from 'react-redux'
import { BrowserRouter, Route, Link ,useHistory } from "react-router-dom";
import axios from "axios"
import { useMoralis } from "react-moralis";
import {CHANGE_WALLET,SELECT_MENU} from "../actionTypes";
import {
    portfolio_data1,portfolio_data2,
    portfolio_table_data
} from "../service/constants"
const Wallet = () => {
    const { authenticate, isAuthenticated, logout,signup,  account, chainId } = useMoralis();
    const dispatch = useDispatch()
    const [ getInputWallet,setInputWallet]=useState('')
    const  walletAddress  =  useSelector(state  =>  state.walletAddress);
    useEffect(() => {
        getChainList()
    },[Wallet]);
    useEffect(() => {
        setInputWallet(walletAddress.address)

    },[walletAddress]);
    
   
    const changeWlletAddress=(e)=>{
        setInputWallet(e.target.value)
    }
    const connectWallet=()=>{
        connectWallet_withoutMetamask()
    }
    const connectWallet_withoutMetamask=()=>{
        if(getInputWallet!="") {
            logout()
            dispatch({type:CHANGE_WALLET,payload:getInputWallet});
            dispatch({type:SELECT_MENU,payload:1});
        }
    }
    const enterWallet=(e)=>{
        if(e.key=='Enter')connectWallet_withoutMetamask()
    }
    const getChainList = async()=>{
        const chainList = await axios.get('https://api.debank.com/portfolio/project_list?user_addr=0x3ddfa8ec3052539b6c9549f12cea2c295cff5296')
        console.log(chainList.data,'chainList----')
    }
return(
    <div className="main-board">
        <div className="sub-main-board-w">
            <div className="sub-main-board-h">
                <h4 className="wallet-title"> How are your<span className="wallet-sub-div">&nbsp;DeFi&nbsp;</span>investments performing?</h4>
                <p className="wallet-small-title">Your Wallet</p>
                <input className="wallet-input form-control" placeholder="Enter your wallet"
                    onChange={(val)=>changeWlletAddress(val)} onKeyUp={(e)=>enterWallet(e)} value={getInputWallet}/>
                <Link  className="btn wallet-connect" to={getInputWallet!=""?'/portfolio/'+getInputWallet:'/'} onClick={()=>connectWallet()}>Connect Now
                </Link>
            </div>
        </div>
    </div>
)
}
// export default Wallet
const mapStateToProps = state => ({
    portfolio_data: state.portfolioData,
    wallet_address: state.walletAddress
})

//connect function INJECTS dispatch function as a prop!!
export default connect(mapStateToProps)(Wallet);