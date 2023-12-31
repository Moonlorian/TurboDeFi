import { ContractFunction, StringValue, U32Value, U64Value } from "@multiversx/sdk-core/out";
import { sendTransaction } from "./contractInteractions";


export const createFlow = async (contract: string, address:string, flowName: string, flowLabel: string, flowDescription: string) => {
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

export const createFlowStep = async (contract: string, address:string, flowId: number, flowDescription: string) => {
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

export const addEndpoint = async (contract: string, address:string, flowId: number, step_index: number, endpointId: number) => {
    await sendTransaction({
        contractAddress: contract,
        functionName: new ContractFunction('addStepEndpoint'),
        sender: address,
        args: [
            new U64Value(flowId),
            new U32Value(step_index),
            new U64Value(endpointId),
        ]
    });
};

export const addComponent = async (contract: string, address:string, flowId: number, step_index: number, componentId: number) => {
    await sendTransaction({
        contractAddress: contract,
        functionName: new ContractFunction('addStepComponent'),
        sender: address,
        args: [
            new U64Value(flowId),
            new U32Value(step_index),
            new U64Value(componentId),
        ]
    });
};
