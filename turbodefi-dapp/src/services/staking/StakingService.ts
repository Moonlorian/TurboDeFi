import { ContractFunction } from "@multiversx/sdk-core/out";
import { sendTransaction } from "services/contractInteractions";

export const claim = async (address:string, sender: string) => {
    await sendTransaction({
        contractAddress: address,
        functionName: new ContractFunction('claimRewards'),
        sender
    });
};

export const redelegate = async (address:string, sender: string) => {
    await sendTransaction({
        contractAddress: address,
        functionName: new ContractFunction('reDelegateRewards'),
        sender
    });

    
};