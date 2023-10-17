import { ContractFunction, StringValue, U64Value } from "@multiversx/sdk-core/out";
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

export const CreateFlowStep = async (contract: string, address:string, flowId: number, flowDescription: string) => {
    await sendTransaction({
        contractAddress: contract,
        functionName: new ContractFunction('addFlowStep'),
        sender: address,
        args: [
            new U64Value(flowId),
            new StringValue(flowDescription)
        ]
    });
};
