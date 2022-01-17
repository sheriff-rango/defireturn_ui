import React, { useState,useEffect } from "react";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import {connect,useSelector,useDispatch} from 'react-redux'
import { BrowserRouter, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { menu_data } from "../service/constants";
import {SELECT_MENU, PORTFOLIO_DATA} from "../actionTypes";

const Menu=()=>{
    const [isVisible, setIsVisible]=useState(true)
    const  menuSelectItem  =  useSelector(state  =>  state.menuSelectItem.item);
    const  walletAddress  =  useSelector(state  =>  state.walletAddress.address);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        console.log(location.pathname.split('/')[1])
        switch (location.pathname.split('/')[1]){
            case 'wallet':dispatch({type:SELECT_MENU,payload:0});break;
            case 'portfolio':dispatch({type:SELECT_MENU,payload:1});break;
            case 'feedback':dispatch({type:SELECT_MENU,payload:2});break;
        }
      },[Menu])
    const onMenuClick=(index)=>{
        if((walletAddress==""||walletAddress==undefined)&& index==1)index=0
        dispatch({type:SELECT_MENU,payload:index});
    }

    const handleOpenJSON=(e)=>{
        var input, file, fr;
          console.log(e.target.files[0])
            file = e.target.files[0];
            fr = new FileReader();
            fr.onload = receivedText;
            fr.readAsText(file);
            var a= document.getElementById('open_json_file')
            a.value=""
      }
      function receivedText(e) {
        let lines = e.target.result;
        let userData = null;
  
        try {
            userData = JSON.parse(lines); 
        } catch (e) {
            userData = lines;
        }
        
         dispatch({type:PORTFOLIO_DATA,payload:userData});
         
         
        //  navigate("/portfolio/"+walletAddress, { replace: true });
      }

    return(
        <div className="sidebar">
            <div className=" defi-logo">
                <div className="logo d-flex">
                    <img className="defi-image" src="../assets/images/defi-icon.jpg"/>
                    <h4 className="defi-title">DefiReturn</h4>
                </div>
            </div>
            <nav className="navbar bg-light left-navbar">
                <ul className="navbar-nav">
                    <Link  className="nav-link" to="/wallet" >
                        <li className="nav-item  d-flex"onClick={()=>onMenuClick(0)} style={{backgroundColor:menuSelectItem==0?'#081945':'#14224f'}}>
                            <img className="menu-icon"src="../assets/images/wallet.jpg"/>
                            <h6 className="menu-item-text">Wallet</h6>
                        </li>
                    </Link>
                    <Link className="nav-link" to={walletAddress!=""&&walletAddress!=undefined?'/portfolio/'+walletAddress:'/wallet'}  >
                        <li className="nav-item d-flex"onClick={()=>onMenuClick(1)} style={{backgroundColor:walletAddress!=""?menuSelectItem==1?'#081945':'#14224f':'#14224f'}}>
                            <img className="menu-icon"src="../assets/images/portfolio.jpg"/> 
                            <h6 className="menu-item-text">Portfolio</h6>
                        </li>
                    </Link>
                    <Link className="nav-link" to="/feedback" >
                        <li className="nav-item d-flex"onClick={()=>onMenuClick(2)} style={{backgroundColor:menuSelectItem==2?'#081945':'#14224f'}}>
                            <img className="menu-icon" src="../assets/images/feedback.jpg"/> 
                            <h6 className="menu-item-text">Feedback</h6>
                        </li>
                    </Link>
                    
                </ul>
                <span className="btn btn-default btn-file">
                  open JSON File  <input type="file" id="open_json_file" name="front" onChange={(e)=>handleOpenJSON(e)} className="ImageUpload" accept="json/*"/>
                </span>
            </nav>
            <div className="menu-image-div">
                <img className="menu-image" src="../assets/images/menu-image.jpg"/>
            </div>
            <nav className="navbar bg-light left-navbar left-navbar-1">
            </nav>
        </div>
    )
}
const mapStateToProps = state => ({
    menuSelectItem: state.menuSelectItem,
    walletAddress: state.walletAddress
})

//connect function INJECTS dispatch function as a prop!!
export default connect(mapStateToProps)(Menu);