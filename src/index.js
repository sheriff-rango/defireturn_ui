import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DAppProvider } from "@usedapp/core";
import { MoralisProvider, useTokenPrice } from "react-moralis";
const APP_ID = "2UitHOmaS7CrsCp0MWL7XjSX6qAASBPrihxJaqEP";
const SERVER_URL = "https://zgwdzyu4ckgi.usemoralis.com:2053/server";
const store = createStore(rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
ReactDOM.render(
<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
  
  <React.StrictMode>
    
    <DAppProvider config={{}}>
      <Provider store={store}>
        <App />
      </Provider>
    </DAppProvider>
    
  </React.StrictMode>
  </MoralisProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
