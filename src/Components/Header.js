import React, { useState ,useEffect} from "react";
import { useLocation } from 'react-router-dom'
import Account from "./Account";
import { useDispatch } from 'react-redux'
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { browserHistory } from 'react-router';
import RLogin, { RLoginButton } from '@rsksmart/rlogin'
import theme from "./theme";
import WalletConnectProvider from '@walletconnect/web3-provider'
import Layout from "./Layout";
import ConnectButton from "./ConnectButton";
import AccountModal from "./AccountModal";
import {CHANGE_WALLET,PORTFOLIO_DATA} from "../actionTypes";
const rLogin = new RLogin({
  cachedProvider: false, // change to true to cache user's wallet choice
  providerOptions: { // read more about providers setup in https://github.com/web3Modal/web3modal/
    walletconnect: {
      package: WalletConnectProvider, // setup wallet connect for mobile wallet support
      options: {
        rpc: {
          31: 'https://public-node.testnet.rsk.co' // use RSK public nodes to connect to the testnet
        }
      }
    }
  },
  supportedChains: [31] // enable rsk testnet network
})
const Header=({ history })=>{
    const location = useLocation();
    const dispatch = useDispatch()
    const [headerTitle, setHeaderTitle]=useState(location.pathname)
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState(null)
    const [account, setAccount] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const connect = () => rLogin.connect()
      .then(({ provider }) => { 
        setProvider(provider)
        provider.request({ method: 'koge_accounts' }).then(([account]) => setAccount(account))
      })
    useEffect(() => {
      console.log(headerTitle,'account---',location.pathname.split('/')[2])
      dispatch({type:CHANGE_WALLET,payload:location.pathname.split('/')[2]});
    },[Header]);


    return(

      <div className="d-flex header-div" >
        {/* <Account/> */}
      <ChakraProvider >
        <Layout>
          <div className="d-flex header-title-div">
            <h3 className="header-title col-4 col-sm-3 col-md-2 col-lg-2 col-xl-2">{location.pathname.split('/')[1]!=""?location.pathname.split('/')[1].charAt(0).toUpperCase()+location.pathname.split('/')[1].slice(1):'Wallet'}</h3>
              
            <div className="wallet-button col-6 col-sm-8 col-md-10 col-lg-10 col-xl-10">
              <ConnectButton handleOpenModal={onOpen} />
              <AccountModal isOpen={isOpen} onClose={onClose} />
            </div>
          </div>
        </Layout>
      </ChakraProvider>
      </div>
    )
}
export default Header