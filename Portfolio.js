import React, { useState,useEffect } from "react";
import {connect} from 'react-redux'
import { BASE_URL } from "../service/constants";
import axios from "axios"
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import  useNativeTransactions  from '../hooks/useNativeTransactions'
import  useERC20Transfers  from '../hooks/useERC20Transfers'
// import { useERC20Transfers } from '../hooks/useERC20Transfers'
import {
    portfolio_data1, portfolio_data2,
    portfolio_table_data
} from "../service/constants"//20138207
//https://api.polygonscan.com/api?module=block&action=getblockreward&blockno=20138207&apikey=61KZHYEFZRVZPPHR1STRS2USVZ3N4V5MJP
//https://api.polygonscan.com/api?module=contract&action=getabi&address=0x510d776fea6469531f8be69e669e553c0de69621&apikey=61KZHYEFZRVZPPHR1STRS2USVZ3N4V5MJP
//https://api.polygonscan.com/api?module=account&action=tokentx&address=0x704111eDBee29D79a92c4F21e70A5396AEDCc44a&startblock=20138207&endblock=20138207&sort=asc&apikey=61KZHYEFZRVZPPHR1STRS2USVZ3N4V5MJP
const Portfolio = (data) => {
    const [portfolio_table1, setPortfolio_table1] = useState(portfolio_data1)
    const [portfolio_table2, setPortfolio_table2] = useState(portfolio_data2)
    const [portfolio_table_body_data, setPortfolio_table_body] = useState(portfolio_table_data)
    const [selHeader1, setSelHeader1] = useState(10)
    const [selHeader2, setSelHeader2] = useState(10)
    const [sort_state, setSort_state] = useState(false)
    const [typeValue, setTypeValue] = useState('')
    const [protocolValue, setProtocolValue] = useState('')
    const [filterButton, setFilterButton] = useState(false)
    const [sort_image, setSort_image] = useState('assets/images/sort_both.png')


    const [getTransaction1, setTransaction1] = useState({})
    const [getTransaction2, setTransaction2] = useState({})
    const [getDateData1, setDateData1]=useState('')
    const [getDateData2, setDateData2]=useState('')

    const [type, setType] = React.useState('All');
    const [chain, setChain] = React.useState('All');
    const [portfolio_data,setPortfolio_data] = useState(data.portfolio_data)
    const { authenticate, isAuthenticated, logout,signup,  account, chainId } = useMoralis();

    const { nativeTransactions } = useNativeTransactions();
    const { fetchERC20Transfers, ERC20Transfers} = useERC20Transfers();

    useEffect(() => {
        getTimeStamp()
        // fetchERC20Transfers()
    },[Portfolio]);

    useEffect(() => {
        console.log(nativeTransactions,'Transactions----',isAuthenticated,'isAuthenticated',ERC20Transfers)
    },[isAuthenticated]);
    const handleChangeType = (event) => {
      setType(event.target.value);
      removeClass_show()
      addClass_collapsed()
    };
    const handleChangeChain = (event) => {
      setChain(event.target.value);
      removeClass_show()
      addClass_collapsed()
    };
    
    const getTimeStamp = () => {
         fetch('https://api.polygonscan.com/api?module=block&action=getblockreward&blockno=20138207&apikey=61KZHYEFZRVZPPHR1STRS2USVZ3N4V5MJP')
        .then(response => response.json())
        .then(data => {
            setTransaction1(data)
            setDateData1(calDate(data))
        })
         fetch('https://api.polygonscan.com/api?module=block&action=getblockreward&blockno=20138192&apikey=61KZHYEFZRVZPPHR1STRS2USVZ3N4V5MJP')
        .then(response => response.json())
        .then(data => {
            setTransaction2(data)
            setDateData2(calDate(data))
        })
    }
    const calDate=(val)=>{
        const milliseconds = val.result.timeStamp * 1000 
        const dateObject = new Date(milliseconds)
        let ampm = dateObject.getUTCHours()>12?'PM':'AM'
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const humanDateFormat = months[dateObject.getMonth()]+'-'+dateObject.getDate()+'-'+dateObject.getFullYear()+' '+(dateObject.getUTCHours() % 12)+':'+dateObject.getMinutes()+':'+dateObject.getSeconds()
        +' '+ampm
        return humanDateFormat//setDateData(humanDateFormat)
    }
    const onSort_1 = (data) => {
        setSelHeader1(data)
        setSelHeader2(10)
        switch (data) {
            case 0: portfolio_data.sort(function (a, b) {
                let x = a.type.title.toLowerCase();
                let y = b.type.title.toLowerCase();
                if (x < y && sort_state) { return -1; }
                if (x > y && sort_state) { return 1; }
                if (x < y && !sort_state) { return 1; }
                if (x > y && !sort_state) { return -1; }
                return 0;
            }); break;
            case 1: portfolio_data.sort(function (a, b) {
                let x = a.protocol.title.toLowerCase();
                let y = b.protocol.title.toLowerCase();
                if (x < y && sort_state) { return -1; }
                if (x > y && sort_state) { return 1; }
                if (x < y && !sort_state) { return 1; }
                if (x > y && !sort_state) { return -1; }
                return 0;
            }); break;
            case 2: portfolio_data.sort(function (a, b) {
                let x = a.assets.title.toLowerCase();
                let y = b.assets.title.toLowerCase();
                if (x < y && sort_state) { return -1; }
                if (x > y && sort_state) { return 1; }
                if (x < y && !sort_state) { return 1; }
                if (x > y && !sort_state) { return -1; }
                return 0;
            }); break;
        }
        setSort_state(!sort_state)
        setPortfolio_data([...portfolio_data])
        if (sort_state) setSort_image('assets/images/sort_top.png')
        else if (!sort_state) setSort_image('assets/images/sort_bottom.png')
        removeClass_show()
        addClass_collapsed()
    }
    const onSort_2 = (data) => {
        setSelHeader2(data)
        setSelHeader1(10)
        switch (data) {
            case 0: portfolio_data.sort(function (a, b) {
                if (sort_state) return b.cost.title - a.cost.title
                if (!sort_state) return a.cost.title - b.cost.title
                return 0;
            }); break;
            case 1: portfolio_data.sort(function (a, b) {
                if (sort_state) return b.value.title - a.value.title
                if (!sort_state) return a.value.title - b.value.title
                return 0;
            }); break;
            case 2: portfolio_data.sort(function (a, b) {
                if (sort_state) return b.profit.title - a.profit.title
                if (!sort_state) return a.profit.title - b.profit.title
                return 0;
            }); break;
            case 3: portfolio_data.sort(function (a, b) {
                if (sort_state) return b.return.title - a.return.title
                if (!sort_state) return a.return.title - b.return.title
                return 0;
            }); break;
        }
        setSort_state(!sort_state)
        setPortfolio_data([...portfolio_data])
        if (sort_state) setSort_image('assets/images/sort_top.png')
        else if (!sort_state) setSort_image('assets/images/sort_bottom.png')
        removeClass_show()
        addClass_collapsed()
    }
    const removeClass_show = () => {
        var element = document.getElementsByClassName("collapse1");
        for(var i=0;i<element.length;i++)
            element[i].classList.remove("show");
    }
    const addClass_collapsed = () => {
        var element = document.getElementsByClassName("td_symbol");
        for(var i=0;i<element.length;i++)
            element[i].classList.add("collapsed");
        var element_1 = document.getElementsByClassName("margin-right-10");
        for(var i=0;i<element.length;i++)
            element_1[i].classList.add("collapsed");
    }
    const onProtocol = (url) => {
        window.open(url);
    }
    const onFilterType=(value)=>{
        let preTable_data = []
        setTypeValue('')
        portfolio_table_data.forEach((item, index) => {
            if(protocolValue!='')item.tokens.forEach((item1,index1)=>{
                if (item.type.title.toLowerCase().includes(value)
                && item1.toLowerCase().includes(protocolValue)) 
                preTable_data.push(item);
                setTypeValue(value); 
            })
            else if(protocolValue==''){if (item.type.title.toLowerCase().includes(value))
                preTable_data.push(item);
                setTypeValue(value);
            }
        })
        setPortfolio_data([...preTable_data])
    }
    const onFilterChain=(value)=>{
        let preTable_data = []
         setProtocolValue('')
        portfolio_table_data.forEach((item, index) => {
            if(value!='all')item.tokens.forEach((item1,index1)=>{
                if (item.type.title.toLowerCase().includes(typeValue)
                && item1.toLowerCase().includes(value)) {
                    preTable_data.push(item);
                }
                setProtocolValue(value);
            })
            else{
                if (item.type.title.toLowerCase().includes(typeValue)){
                    preTable_data.push(item);
                }
                setProtocolValue('');
            }
        })
        setPortfolio_data([...preTable_data])
    }
    const onFilter=()=>{
         setTypeValue('')
         setProtocolValue('')
         setType('All')
         setChain('All')
        switch (filterButton){
            case false:setFilterButton(true);break;
            case true:setPortfolio_data(portfolio_table_data);setFilterButton(false);break;
        }
    }
    return (
        <div className="main-board">
            <div className="main-board-title-div d-flex">
                <div className="main-board-title-current-value-div">
                    Current Value
                    <span className="main-board-title-current-value">$1,312</span>
                </div>
                <div className="main-board-title-unlealized-profit-div">
                    Unrealized Profit
                    <span className="main-board-title-current-value">$462&nbsp;<span className="fontWeight-500">(54%)</span></span>
                </div>
                <a className="main-board-title-filter-div " onClick={()=>onFilter()} data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    <div className="d-flex main-board-title-filter-btn">
                        <h6 className="main-board-title-filer-title">Filter</h6>
                        <img className="main-board-title-filer-image" src="assets/images/filter.jpg" />
                    </div>
                </a>
            </div>
            <div className="filter-button-group row collapse"id="collapseExample">
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select style={{borderColor:'#5e5e5e'}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Age"
                        onChange={handleChangeType}
                        >
                        <MenuItem onClick={()=>onFilterType('')}value={'All'}>All</MenuItem>
                        <MenuItem onClick={()=>onFilterType('wallet')}value={'Wallet'}>Wallet</MenuItem>
                        <MenuItem onClick={()=>onFilterType('yield')}value={'Yield'}>Yield Farming</MenuItem>
                        <MenuItem onClick={()=>onFilterType('lending')}value={'Lending'}>Lending</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Chain</InputLabel>
                        <Select style={{borderColor:'#5e5e5e'}}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={chain}
                        label="Age"
                        onChange={handleChangeChain}
                        // onChange={(vlaue)=>onFilterChain(value)}
                        >
                        <MenuItem onClick={()=>onFilterChain('all')}value={'All'}>All</MenuItem>
                        <MenuItem onClick={()=>onFilterChain('ethereum')}value={'Ethereum'}>Ethereum</MenuItem>
                        <MenuItem onClick={()=>onFilterChain('binance')}value={'Binance'}>Binance Smart Chain</MenuItem>
                        <MenuItem onClick={()=>onFilterChain('polygon')}value={'Polygon'}>Polygon</MenuItem>
                        <MenuItem onClick={()=>onFilterChain('avalanche')}value={'Avalanche'}>Avalanche</MenuItem>
                        <MenuItem onClick={()=>onFilterChain('fantom')}value={'Fantom'}>Fantom</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <div className="table-board">
                <table className="table portfolio-table">
                    <thead >
                        <tr className="table-header-tr">
                            <th key="123" className="table-header"></th>
                            {portfolio_table1.map((item, index) => {
                                return <th key={index} className="table-header left-area" onClick={() => onSort_1(index)}>{item.header.toUpperCase()}
                                    <img className="sort-image" src={index != selHeader1 ? 'assets/images/sort_both.png' : sort_state ? 'assets/images/sort_top.png' : 'assets/images/sort_bottom.png'} /></th>
                            })}
                            {portfolio_table2.map((item, index) => {
                                return <th key={index} className="table-header  right-area" onClick={() => onSort_2(index)}>{item.header.toUpperCase()}
                                    <img className="sort-image" src={index != selHeader2 ? 'assets/images/sort_both.png' : sort_state ? 'assets/images/sort_top.png' : 'assets/images/sort_bottom.png'} />
                                </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {portfolio_data.map((item, index) => {
                            return <><tr key={index} className="table-tr accordion-toggle " 
                                id="accordion1" >
                                <td className="table-body expand-button td_symbol  collapsed " data-toggle="collapse" href={`#${item.id}`} ></td>
                                <td className="table-body"><img className="table-td-s-image" src={item.type.img} />{item.type.title}</td>
                                <td className="table-body table-body-protocol">
                                        <a href={item.link.title} target="_blank">
                                    <img className="table-td-m-image table-td-m-image-margin" src={item.protocol.img} />{item.protocol.title}
                                    </a></td>
                                <td className="table-body d-flex">
                                    <div className="table-assets-item d-flex"><img className="table-td-m-image" src={item.assets.img[0]} />
                                        {item.assets.img.length == 2 ? <img className="table-td-m-image table-td-m-image-margin" src={item.assets.img[1]} /> : <></>}
                                    </div>{item.assets.title}</td>
                                <td className="table-body-num">${item.cost.title.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className="table-body-num">${item.value.title.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className="table-body-num" style={{ color: item.profit.title < 0 ? '#dd3279' : 'white' }}>{item.profit.title < 0 ?'-':''}${Math.abs(item.profit.title).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                <td className="table-body-num" style={{ color: item.return.title < 0 ? '#dd3279' : 'white' }}>{item.return.title}%</td>
                            </tr>
                                <tr key={index + '-' + index} className="hide-table-padding" >
                                    <td colSpan="8" className="collapes-td">
                                        <div id={item.id} className="collapse collapse1">
                                            <div className="row border-1">
                                                <div className="col-3 sub-table-header left-area">DATE</div>
                                                <div className="col-3 sub-table-header left-area">TOKEN</div>
                                                <div className="col-2 sub-table-header right-area">UNITS</div>
                                                <div className="col-2 sub-table-header right-area">COST</div>
                                                <div className="col-2 sub-table-header right-area">FEE</div>
                                            </div>
                                            {
                                                item.children.map((item1,index1)=>{
                                                    return <div className={index1 == 0 ? "" : "collapse collapse1"} key={index1} id={item.id + '-' + item1.level} >
                                                        <div className="row border-1" >
                                                            <div className="col-3 sub-table-body sub-table-body-level d-flex">
                                                            <div className="sub-tree-marker-date" id="aaa" >
                                                                <button className="margin-right-10 collapsed" data-toggle="collapse" target="_blank" href={portfolio_data[index] ? `#${item.id + '-' + (item1.level + 1)}` : ''}></button >
                                                                <a className="margin-left-10" target="_blank" href={item1.date.url}>{getDateData1}</a>
                                                            </div>
                                                            <div className="sub-tree-marker" id="aaa" ></div>
                                                            <div className="sub-tree-marker" id="aaa" ></div>
                                                            <div className="sub-tree-marker" id="aaa" ></div>
                                                            </div>
                                                            <div className="col-3 sub-table-body sub-table-body-text">
                                                                <a href={item1.tokenName.url} target="_blank" className="sub-table-body-text"><img className="sub-table-image" src={item1.tokenName.img} />
                                                                {item1.tokenName.title}</a>
                                                            </div>
                                                            <div className="col-2 sub-table-body sub-table-body-num">+{item1.txToken.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                            <div className="col-2 sub-table-body sub-table-body-num">${item1.costbasis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                            <div className="col-2 sub-table-body sub-table-body-num">{item1.fee?'$'+item1.fee:''}</div>
                                                        </div>

                                                        <div className="collapse collapse1" id={item.id + '-' + item1.children[0].level} >
                                                            <div className="row border-1" >
                                                                <div className="col-3 sub-table-body sub-table-body-level d-flex">
                                                                    <div className="sub-tree-marker" id="aaa" ></div>
                                                                    <div className="sub-tree-marker-date" id="aaa" >
                                                                        <button className="margin-right-10  collapsed" data-toggle="collapse" target="_blank" href={portfolio_data[index] ? `#${item.id + '-' + (item1.children[0].level + 1)}` : ''}></button >
                                                                        <a className="margin-left-10" target="_blank" href={item1.children[0].date.url}>{getDateData2}</a>
                                                                    </div>
                                                                    <div className="sub-tree-marker" id="aaa" ></div>
                                                                    <div className="sub-tree-marker" id="aaa" ></div>
                                                                </div>
                                                                <div className="col-3 sub-table-body sub-table-body-text">
                                                                    <a href={item1.children[0].tokenName.url} target="_blank" className="sub-table-body-text"><img className="sub-table-image" src={item1.children[0].tokenName.img} />
                                                                    {item1.children[0].tokenName.title}</a>
                                                                </div>
                                                                <div className="col-2 sub-table-body sub-table-body-num">+{item1.children[0].txToken.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                                <div className="col-2 sub-table-body sub-table-body-num">${item1.children[0].costbasis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                                <div className="col-2 sub-table-body sub-table-body-num">{item1.children[0].fee?'$'+item1.children[0].fee:''}</div>
                                                            </div>
                                                            <div className="collapse collapse1" id={item.id + '-' + item1.children[0].children[0].level} >
                                                                {item1.children[0].children.map((item2,index2)=>{
                                                                    return <div className="row border-1" key={index2} >
                                                                    <div className="col-3 sub-table-body sub-table-body-level d-flex">
                                                                        <div className="sub-tree-marker" id="aaa" ></div>
                                                                        <div className="sub-tree-marker" id="aaa" ></div>
                                                                        <div className="sub-tree-marker-date" id="aaa" ><a className="margin-left-10" target="_blank" href={item1.children[0].date.url}>{getDateData2}</a></div>
                                                                        
                                                                        <div className="sub-tree-marker" id="aaa" ></div>
                                                                    </div>
                                                                    <div className="col-3 sub-table-body sub-table-body-text">
                                                                        <a href={item2.tokenName.url} target="_blank" className="sub-table-body-text"><img className="sub-table-image" src={item2.tokenName.img} />
                                                                        {item2.tokenName.title}</a>
                                                                    </div>
                                                                    <div className="col-2 sub-table-body sub-table-body-num">+{item2.txToken.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                                    <div className="col-2 sub-table-body sub-table-body-num">${item2.costbasis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                                    <div className="col-2 sub-table-body sub-table-body-num">{item2.fee?'$'+item2.fee:''}</div>
                                                                </div>
                                                            })}
                                                            
                                                            </div>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </td>
                                </tr>
                            </>
                        })}

                        {portfolio_data.length > 0 ?
                            <tr className=" total-tr">
                                <td></td>
                                <td colSpan="3" className="table-total-title">Total</td>
                                <td className="table-total-td table-body-num">
                                    ${portfolio_data.map((item) => { return item.cost.title }).reduce((a, b) => a + b, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className="table-total-td table-body-num">
                                    ${portfolio_data.map((item) => { return item.value.title }).reduce((a, b) => a + b, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className="table-total-td table-body-num"
                                    style={{
                                        color: (portfolio_data.map((item) => { return item.value.title }).reduce((a, b) => a + b, 0)
                                            - portfolio_data.map((item) => { return item.cost.title }).reduce((a, b) => a + b, 0)) < 0 ? '#dd3279' : 'white'
                                    }}>
                                    ${Math.abs(portfolio_data.map((item) => { return item.value.title }).reduce((a, b) => a + b, 0)
                                        - portfolio_data.map((item) => { return item.cost.title }).reduce((a, b) => a + b, 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className="table-total-td table-body-num"
                                    style={{
                                        color: (portfolio_data.map((item) => { return item.value.title }).reduce((a, b) => a + b, 0)
                                            - portfolio_data.map((item) => { return item.cost.title }).reduce((a, b) => a + b, 0))
                                            / portfolio_data.map((item) => { return item.cost.title }).reduce((a, b) => a + b, 0)
                                            * 100 < 0 ? '#dd3279' : 'white'
                                    }}
                                >
                                    {Math.round((portfolio_data.map((item) => { return item.value.title }).reduce((a, b) => a + b, 0)
                                        - portfolio_data.map((item) => { return item.cost.title }).reduce((a, b) => a + b, 0))
                                        / portfolio_data.map((item) => { return item.cost.title }).reduce((a, b) => a + b, 0)
                                        * 100)}%
                                </td>
                            </tr>
                            : <tr className=" total-tr total-tr-no-data"><td colSpan="8"> There is no data</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
// export default Portfolio
const mapStateToProps = state => ({
    portfolio_data: state.counterApp
})

//connect function INJECTS dispatch function as a prop!!
export default connect(mapStateToProps)(Portfolio);