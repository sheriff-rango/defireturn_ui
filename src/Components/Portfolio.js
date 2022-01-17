import React, { useState,useEffect } from "react";
import {connect,useSelector} from 'react-redux'
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {
    portfolio_data1, portfolio_data2,
    // portfolio_table_data
} from "../service/constants"

//20138207
//https://api.polygonscan.com/api?module=block&action=getblockreward&blockno=20138207&apikey=61KZHYEFZRVZPPHR1STRS2USVZ3N4V5MJP
//https://api.polygonscan.com/api?module=contract&action=getabi&address=0x510d776fea6469531f8be69e669e553c0de69621&apikey=61KZHYEFZRVZPPHR1STRS2USVZ3N4V5MJP
//https://api.polygonscan.com/api?module=account&action=tokentx&address=0x704111eDBee29D79a92c4F21e70A5396AEDCc44a&startblock=20138207&endblock=20138207&sort=asc&apikey=61KZHYEFZRVZPPHR1STRS2USVZ3N4V5MJP
const Portfolio = (data) => {
    const [portfolio_table1, setPortfolio_table1] = useState(portfolio_data1)
    const [portfolio_table2, setPortfolio_table2] = useState(portfolio_data2)
    const [portfolio_table_body_data, setPortfolio_table_body] = useState([])
    const [selHeader1, setSelHeader1] = useState(10)
    const [selHeader2, setSelHeader2] = useState(10)
    const [sort_state, setSort_state] = useState(false)
    const [typeValue, setTypeValue] = useState('all')
    const [protocolValue, setProtocolValue] = useState('all')
    const [filterButton, setFilterButton] = useState(false)
    const [sort_image, setSort_image] = useState('../assets/images/sort_both.png')
    const [type, setType] = React.useState('All');
    const [chain, setChain] = React.useState('All');
    const [ getTotalVal, setTotalVal ] = useState({totalCost:0,totalValue:0})
    const  portfolioPreData  =  useSelector(state  =>  state.portfolioData);
    const  [portfolioData,setportfolioData]  =  useState([]);
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
      const makeHistory=(historyData)=>{
          let data=[]
          let level_0=0
          let level_1=0
          let level_2=0
          let level_3=0
          historyData.map((item,index)=>{
              if(item.hierarchy_level==0){
                  Object.assign(item,{child:[]})
                  data.push(item)
                  level_0++
                  level_1=0
                }else if(item.hierarchy_level==1){
                    Object.assign(item,{child:[]})
                  data[level_0-1].child.push(item)
                  level_1++
                  level_2=0
                }else if(item.hierarchy_level==2){
                    Object.assign(item,{child:[]})
                  data[level_0-1].child[level_1-1].child.push(item)
                  level_2++
                }
                else if(item.hierarchy_level==3){
                    Object.assign(item,{child:[]})
                  data[level_0-1].child[level_1-1].child[level_2-1].child.push(item)
                  level_3++
                }
          })
          console.log(data,'history data-----------')
          return data
      }
      useEffect(() => {
          setportfolioData(portfolioPreData.map(item=>{
            return{id: item.id,
                    chain:item.chain,
                    chain_id:item.chain_id,
                    chain_logo: item.chain_logo,
                    type: item.type,
                    type_img: item.type_img,
                    protocol: item.protocol,
                    protocol_url: item.protocol_url,
                    protocol_logo:item.protocol_logo,
                    pool: item.pool,
                    assets:item.assets,
                    units: item.units,
                    cost_basis:item.cost_basis,
                    value: item.value,
                    _comment: item._comment,
                    profit:item.value-item.cost_basis,
                    return:(item.value-item.cost_basis)/item.cost_basis*100,
                    history: item.history
                    // history: item.history?item.history.length>0?makeHistory(item.history):[]:[]
    
        }}))
        },[portfolioPreData]);

      useEffect(() => {
        setPortfolio_table_body(portfolioData)
        calc_totalVal(portfolioData)
        },[portfolioData]);

    const calc_totalVal=(data)=>{
        setTotalVal({totalCost:data.map((item) => { return item.cost_basis }).reduce((a, b) => a + b, 0),
            totalValue:data.map((item) => { return item.value }).reduce((a, b) => a + b, 0)})
    }
      const calDate=(val)=>{
          const milliseconds = val * 1000 
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
              case 0: portfolio_table_body_data.sort(function (a, b) {
                  let x = a.type.toLowerCase();
                  let y = b.type.toLowerCase();
                  if (x < y && sort_state) { return -1; }
                  if (x > y && sort_state) { return 1; }
                  if (x < y && !sort_state) { return 1; }
                  if (x > y && !sort_state) { return -1; }
                  return 0;
              }); break;
              case 1: portfolio_table_body_data.sort(function (a, b) {
                  let x = a.protocol.toLowerCase();
                  let y = b.protocol.toLowerCase();
                  if (x < y && sort_state) { return -1; }
                  if (x > y && sort_state) { return 1; }
                  if (x < y && !sort_state) { return 1; }
                  if (x > y && !sort_state) { return -1; }
                  return 0;
              }); break;
              case 2: portfolio_table_body_data.sort(function (a, b) {
                  let x = a.assets[0].ticker.toLowerCase();
                  let y = b.assets[0].ticker.toLowerCase();
                  if (x < y && sort_state) { return -1; }
                  if (x > y && sort_state) { return 1; }
                  if (x < y && !sort_state) { return 1; }
                  if (x > y && !sort_state) { return -1; }
                  return 0;
              }); break;
          }
          setSort_state(!sort_state)
          setPortfolio_table_body([...portfolio_table_body_data])
          if (sort_state) setSort_image('../assets/images/sort_top.png')
          else if (!sort_state) setSort_image('../assets/images/sort_bottom.png')
          removeClass_show()
          addClass_collapsed()
      }
      const onSort_2 = (data) => {
          setSelHeader2(data)
          setSelHeader1(10)
          switch (data) {
              case 0: portfolio_table_body_data.sort(function (a, b) {
                  if (sort_state) return b.cost_basis - a.cost_basis
                  if (!sort_state) return a.cost_basis - b.cost_basis
                  return 0;
              }); break;
              case 1: portfolio_table_body_data.sort(function (a, b) {
                  if (sort_state) return b.value - a.value
                  if (!sort_state) return a.value - b.value
                  return 0;
              }); break;
              case 2: portfolio_table_body_data.sort(function (a, b) {
                  if (sort_state) return b.profit - a.profit
                  if (!sort_state) return a.profit- b.profit
                  return 0;
              }); break;
              case 3: portfolio_table_body_data.sort(function (a, b) {
                  if (sort_state) return b.return - a.return
                  if (!sort_state) return a.return - b.return
                  return 0;
              }); break;
          }
          setSort_state(!sort_state)
          setPortfolio_table_body([...portfolio_table_body_data])
          if (sort_state) setSort_image('../assets/images/sort_top.png')
          else if (!sort_state) setSort_image('../assets/images/sort_bottom.png')
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
  
          console.log(value,protocolValue)
          portfolioData.forEach((item, index) => {
              if(protocolValue!='all'){
                if(value=='all')
                    if (item.protocol.toLowerCase().includes(protocolValue)){
                        preTable_data.push(item);
                } 
                else if(value!='all')
                  if (item.type.toLowerCase().includes(value)
                  && item.protocol.toLowerCase().includes(protocolValue)){
                    preTable_data.push(item);
                    
                } 
                setTypeValue(value);
            } 
            else if(protocolValue=='all'){
                if(value=='all'){
                    preTable_data.push(item);
                    setTypeValue('all');
                }
                else if(value!='all')
                    if (item.type.toLowerCase().includes(value)){
                        preTable_data.push(item);
                        
                    }
                    setTypeValue(value);
                }
                
            }
        )
          setPortfolio_table_body([...preTable_data])
      }
      const onFilterChain=(value)=>{
          let preTable_data = []
          console.log(value)
          portfolioData.forEach((item, index) => {
                if(value!='all'){
                    if(typeValue!='all'){
                        if (item.type.toLowerCase().includes(typeValue)
                            && item.protocol.toLowerCase().includes(value)) {
                            preTable_data.push(item);
                        }}
                    else if(typeValue=='all'){
                        if (item.protocol.toLowerCase().includes(value)) {
                            preTable_data.push(item);
                            
                        }}
                    setProtocolValue(value);
                  }
                else if(value=='all'){
                    if(typeValue!='all'){
                        if (item.type.toLowerCase().includes(typeValue)){
                            preTable_data.push(item);
                            setProtocolValue(value);
                        }
                    }
                    else if(typeValue=='all'){
                        preTable_data.push(item);
                        
                    }
                  setProtocolValue('all');
                
              }
              
          })
          setPortfolio_table_body([...preTable_data])
      }
      const onFilter=()=>{
           setTypeValue('all')
           setProtocolValue('all')
           setType('All')
           setChain('All')
          switch (filterButton){
              case false:setFilterButton(true);break;
              case true:setPortfolio_table_body(portfolioData);setFilterButton(false);break;
          }
      }
    //   const make_child_tree_structure=(data,item,index,index1)=>{
    //         index1++
    //         return <> <div className={data.hierarchy_level == 0 ? "" :"collapse collapse1"}  id={item.id + '-' + data.hierarchy_level} >
    //             <div className="row border-1" >
    //                   <div className="col-3 sub-table-body sub-table-body-level d-flex">
                      
    //                     {item.history.map((item2,index2)=>{
    //                         return <div key={index2} className={index2==data.hierarchy_level?"sub-tree-marker-date1":"sub-tree-marker-date2"} id="aaa" >
    //                             {index2==data.hierarchy_level?<>{item2.hierarchy_level<item.history[item.history.length-1].hierarchy_level?<button className="margin-right-10 collapsed children-date"
    //                                 data-toggle="collapse" target="_blank" href={portfolio_table_body_data[index] ? `#${item.id + '-' + (data.hierarchy_level + 1)}` : ''}></button >
    //                             :<></>}
    //                             <a className="margin-left-10" target="_blank" href={data.transaction_url}title={data.transaction_url}>{data.datetime.slice(0, 23)}</a></>:<></>}
    //                         </div>
    //                     })}
    //                   </div>
    //                   <div className="col-3 sub-table-body sub-table-body-text" title={data.token_url}>
    //                       <a href={data.token_url} target="_blank" className="sub-table-body-text"><img className="sub-table-image" src={data.token_img} />
    //                       {data.token_name}</a>
    //                   </div>
    //                   <div className="col-2 sub-table-body sub-table-body-num">+{data.units.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
    //                   <div className="col-2 sub-table-body sub-table-body-num">${data.cost_basis.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
    //                   <div className="col-2 sub-table-body sub-table-body-num">{data.fee_usd?'$'+data.fee_usd.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''}</div>
    //             </div>
    //             {item.history[index1] && item.history[index1].hierarchy_level == item.history[index1-1].hierarchy_level+1? make_child_tree_structure(item.history[index1],item,index,index1):()=>{return<></>}
    //             }
    //         </div>
    //         {item.history[index1] && item.history[index1].hierarchy_level == item.history[index1-1].hierarchy_level? make_child_tree_structure(item.history[index1],item,index,index1):()=>{return<></>}}
    //         </> 
    //   }
    const make_child_tree_structure=(data,item,index,index1,num)=>{
        index1++
        return  <div className="row border-1" >
                  <div className="col-3 sub-table-body sub-table-body-level d-flex">
                  {data.child && data.child.length>0?<button className="margin-right-10 collapsed children-date"
                                style={{marginLeft:data.hierarchy_level*10+'px'}}
                                data-toggle="collapse" target="_blank" href={portfolio_table_body_data[index] ? `#${item.id + '-' + (data.hierarchy_level)+'-'+num}` : ''}></button >:<button style={{marginLeft:data.hierarchy_level*20+'px'}}></button>}
                      <a className="margin-left-10" target="_blank" href={data.transaction_url}title={data.transaction_url}>{data.datetime.slice(0, 23)}</a>          
                    {/* {item.history.map((item2,index2)=>{
                        return <div key={index2} className={index2==data.hierarchy_level?"sub-tree-marker-date1":"sub-tree-marker-date2"} id="aaa" >
                            {index2==data.hierarchy_level?<>{item2.hierarchy_level<item.history[item.history.length-1].hierarchy_level?<button className="margin-right-10 collapsed children-date"
                                data-toggle="collapse" target="_blank" href={portfolio_table_body_data[index] ? `#${item.id + '-' + (data.hierarchy_level + 1)}` : ''}></button >
                            :<></>}
                            <a className="margin-left-10" target="_blank" href={data.transaction_url}title={data.transaction_url}>{data.datetime.slice(0, 23)}</a></>:<></>}
                        </div>
                    })} */}
                  </div>
                  <div className="col-3 sub-table-body sub-table-body-text" title={data.token_url}>
                      <a href={data.token_url} target="_blank" className="sub-table-body-text"><img className="sub-table-image" src={data.token_img} />
                      {data.token_name}</a>
                  </div>
                  <div className="col-2 sub-table-body sub-table-body-num">{data.units>0?'+':data.units<0?'-':''}{Math.abs(data.units).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                  <div className="col-2 sub-table-body sub-table-body-num">{data.cost_basis>0?'$':data.cost_basis<0?'-$':''}{Math.abs(data.cost_basis).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                  <div className="col-2 sub-table-body sub-table-body-num">{data.fee_usd?'$'+data.fee_usd.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''}</div>
            </div>
  }
      return (
          <div className="main-board">
              <div className="main-board-title-div d-flex">
                  <div className="main-board-title-current-value-div">
                      Current Value
                      <span className="main-board-title-current-value">${getTotalVal.totalValue.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                  </div>
                  <div className="main-board-title-unlealized-profit-div">
                      Unrealized Profit
                      <span className="main-board-title-current-value">${(getTotalVal.totalValue-getTotalVal.totalCost).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}&nbsp;<span className="fontWeight-500">
                          ({getTotalVal.totalCost!=0?((getTotalVal.totalValue-getTotalVal.totalCost)/getTotalVal.totalCost*100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):0}%)</span></span>
                  </div>
                  <a className="main-board-title-filter-div " onClick={()=>onFilter()} data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                      <div className="d-flex main-board-title-filter-btn">
                          <h6 className="main-board-title-filer-title">Filter</h6>
                          <img className="main-board-title-filer-image" src="../assets/images/filter.jpg" />
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
                          <MenuItem onClick={()=>onFilterType('all')}value={'All'}>All</MenuItem>
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
                                      <img className="sort-image" src={index != selHeader1 ? '../assets/images/sort_both.png' : sort_state ? '../assets/images/sort_top.png' : '../assets/images/sort_bottom.png'} /></th>
                              })}
                              {portfolio_table2.map((item, index) => {
                                  return <th key={index} className="table-header  right-area" onClick={() => onSort_2(index)}>{item.header.toUpperCase()}
                                      <img className="sort-image" src={index != selHeader2 ? '../assets/images/sort_both.png' : sort_state ? '../assets/images/sort_top.png' : '../assets/images/sort_bottom.png'} />
                                  </th>
                              })}
                          </tr>
                      </thead>
                      <tbody>
                          {portfolio_table_body_data.map((item, index) => {
                              return <><tr key={index} className="table-tr accordion-toggle " 
                                  id="accordion1" >
                                  {item.history?item.history.length>0?<td className="table-body expand-button td_symbol  collapsed " data-toggle="collapse" href={`#${item.id}`} ></td>:
                                    <td></td>:<td></td>}
                                  <td className="table-body"><img className="table-td-s-image" src={item.type_img} />{item.type}</td>
                                  <td className="table-body table-body-protocol" title={item.protocol_url}>
                                          <a href={item.protocol_url} target="_blank">
                                      <img className="table-td-m-image table-td-m-image-margin" src={item.type=="Wallet"?item.chain_logo:item.protocol_logo} />{item.protocol}
                                      </a></td>
                                  <td className="table-body d-flex">
                                      <div  className="table-assets-item d-flex">
                                          {item.assets.map((item4,index4)=>{return <img key={index4}className="table-td-m-image" src={item4.logo} />})}
                                      </div>{item.assets.map((item4,index4)=>{return <span key={index4}>{index4==0?item4.ticker:'+'+item4.ticker}</span>})}
                                    </td>
                                  <td className="table-body-num">${item.cost_basis.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                  <td className="table-body-num">${item.value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                  <td className="table-body-num" style={{ color: item.value-item.cost_basis < 0 ? '#dd3279' : 'white' }}>{item.value-item.cost_basis < 0 ?'-':''}${Math.abs(item.value-item.cost_basis).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                  <td className="table-body-num" style={{ color: (item.value-item.cost_basis)/item.cost_basis < 0 ? '#dd3279' : 'white' }}>{((item.value-item.cost_basis)/item.cost_basis*100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%</td>
                                </tr>
                                {item.history && item.history.length>0 && <tr key={index + '-' + index} className="hide-table-padding" >
                                    <td colSpan="8" className="collapes-td">
                                        <div id={item.id} className="collapse collapse1">
                                            <div className="row border-1">
                                                {/* <div className="col-2 sub-table-header"> </div> */}
                                                <div className="col-3 sub-table-header left-area">DATE</div>
                                                <div className="col-3 sub-table-header left-area">TOKEN</div>
                                                <div className="col-2 sub-table-header right-area">UNITS</div>
                                                <div className="col-2 sub-table-header right-area">COST</div>
                                                <div className="col-2 sub-table-header right-area">FEE</div>
                                            </div>
                                            {item.history && item.history.length>0 ? 
                                                item.history.map((ele,num)=>{
                                                return <div key={num} className={ele.hierarchy_level == 0 ? "" :"collapse collapse1"}  id={item.id} >
                                                                {make_child_tree_structure(ele,item,index,0,num)}
                                                            {ele.child && ele.child.length>0 ? 
                                                                ele.child.map((ele1,num1)=>{
                                                                    return  <div key={num1} className={ele1.hierarchy_level == 0 ? "" :"collapse collapse1"}  id={item.id + '-' + ele.hierarchy_level + '-' + num} >
                                                                                    {make_child_tree_structure(ele1,item,index,0,num+''+num1)}
                                                                                {ele1.child && ele1.child.length>0 ? 
                                                                                    ele1.child.map((ele2,num2)=>{
                                                                                        return <div key={num2} className={ele2.hierarchy_level == 0 ? "" :"collapse collapse1"}  id={item.id + '-' + ele1.hierarchy_level + '-' + num+''+num1} >
                                                                                                        {make_child_tree_structure(ele2,item,index,0,num+''+num1+''+num2)}
                                                                                            {ele2.child && ele2.child.length>0 ? 
                                                                                                ele2.child.map((ele3,num3)=>{
                                                                                                    return <div key={num3} className={ele3.hierarchy_level == 0 ? "" :"collapse collapse1"}  id={item.id + '-' + ele2.hierarchy_level + '-' + num+''+num1+''+num2} >
                                                                                                                {make_child_tree_structure(ele3,item,index,0,num3)}
                                                                                                            </div>
                                                                                                })
                                                                                                :null}
                                                                                        </div>
                                                                                    })
                                                                                    :null}
                                                                            </div>
                                                                })
                                                                :null}
                                                        </div>
                                                })
                                                :null
                                            }
                                        </div>
                                    </td>
                                </tr>}
                              </>
                          })}
  
                          {portfolio_table_body_data.length > 0 ?
                              <tr className=" total-tr">
                                  <td></td>
                                  <td colSpan="3" className="table-total-title">Total</td>
                                  <td className="table-total-td table-body-num">
                                      ${portfolio_table_body_data.map((item) => { return item.cost_basis }).reduce((a, b) => a + b, 0).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </td>
                                  <td className="table-total-td table-body-num">
                                      ${portfolio_table_body_data.map((item) => { return item.value }).reduce((a, b) => a + b, 0).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </td>
                                  <td className="table-total-td table-body-num"
                                      style={{
                                          color: (portfolio_table_body_data.map((item) => { return item.value }).reduce((a, b) => a + b, 0)
                                              - portfolio_table_body_data.map((item) => { return item.cost_basis }).reduce((a, b) => a + b, 0)) < 0 ? '#dd3279' : 'white'
                                      }}>
                                      ${Math.abs(portfolio_table_body_data.map((item) => { return item.value }).reduce((a, b) => a + b, 0)
                                          - portfolio_table_body_data.map((item) => { return item.cost_basis }).reduce((a, b) => a + b, 0)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </td>
                                  <td className="table-total-td table-body-num"
                                      style={{
                                          color: (portfolio_table_body_data.map((item) => { return item.value }).reduce((a, b) => a + b, 0)
                                              - portfolio_table_body_data.map((item) => { return item.cost_basis }).reduce((a, b) => a + b, 0))
                                              / portfolio_table_body_data.map((item) => { return item.cost_basis }).reduce((a, b) => a + b, 0)
                                              * 100 < 0 ? '#dd3279' : 'white'
                                      }}
                                  >
                                      {Math.round((portfolio_table_body_data.map((item) => { return item.value }).reduce((a, b) => a + b, 0)
                                          - portfolio_table_body_data.map((item) => { return item.cost_basis }).reduce((a, b) => a + b, 0))
                                          / portfolio_table_body_data.map((item) => { return item.cost_basis }).reduce((a, b) => a + b, 0)
                                          * 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%
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
    portfolio_data: state.portfolioData,
    wallet_address: state.walletAddress
})

//connect function INJECTS dispatch function as a prop!!
export default connect(mapStateToProps)(Portfolio);