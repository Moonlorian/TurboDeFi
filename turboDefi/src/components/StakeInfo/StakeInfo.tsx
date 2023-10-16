import React, { useEffect, useState } from "react";
import BigNumber from 'bignumber.js';
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks/account/useGetAccountInfo";
import { getDelegated } from "services";

export const StakeInfo = () => {
    
    type stakedInfoType = {
    address: string,
    contract: string,
    userUnBondable: BigNumber,
    userActiveStake: BigNumber,
    claimableRewards: BigNumber,
    userUndelegatedList: [
      {
        amount: BigNumber,
        seconds: number
      }
    ]
    };
    const [stakedInfo, setStakedInfo] = useState<stakedInfoType>();
    const { address } = useGetAccountInfo();

    const loadStakedInfo = async () => {
        const delegatedList = await getDelegated(address);
        console.log(delegatedList);
    };
    

    useEffect(() => {
        loadStakedInfo();
    }, []);
    return(
        <p>Stake info component</p>
    );
};