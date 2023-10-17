import { ContractFunction, StringValue } from "@multiversx/sdk-core/out";
import { sendTransaction } from "./contractInteractions";


export const CreateFlow = async (contract: string, address:string, flowName: string, flowLabel: string, flowDescription: string) => {
    await sendTransaction({
        contractAddress: contract,
        functionName: new ContractFunction('addFlow'),
        sender: address,
        args: [
            new StringValue(flowName),
            new StringValue(flowLabel),
            new StringValue(flowDescription)
        ]
    });
};
