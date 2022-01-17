
import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

export const useBasisCost = (options) => {
  const { tokenApi, accountApi } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();
  const [assets, setAssets] = useState();


  useEffect(() => {
    if (!options || !isInitialized) return null;
    fetchCostBasis(options.wallet, options.token, options.block)
      .then((value) => setAssets(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, options]);

  async function fetchCostBasis(chain, wallet, token, block){
    const tokenPrice = await tokenApi.getTokenPrice({ chain, address: token, to_block: block }) 
    const balances = await accountApi.getTokenBalances({ address: wallet, chain, to_block: block })
    
    let balance = balances[0].value
    let costBasis = 0
  
    const transfers = []
    
    for(let i in transfers){
      const transfer = transfers[i]
  
      if(transfer.address == token){
        const sign = transfer.from_address == wallet?1:-1
        balance += sign*transfer.value
      }else{
        const sign = transfer.from_address == wallet?-1:1
        costBasis += sign*fetchCostBasis(chain, wallet, transfer.address, transfer.block_number)
      }
    }
  
    return costBasis
  }
  return { calcBasisCost, assets };
};
