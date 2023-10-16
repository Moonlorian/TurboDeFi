import { Address, AddressValue, BytesType, BytesValue, ResultsParser, U64Value } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { FlowEndpointType, FlowType } from "pages/Flow";
import { smartContract } from "utils/smartContract";

class TurbodefiContractService {

    private gatewayUrl: string;

    constructor(apiUrl: string) {
        this.gatewayUrl = apiUrl;
    }

    async getEndpointById(id: number): Promise<FlowEndpointType> {

        const provider = new ProxyNetworkProvider(
            this.gatewayUrl,
            { timeout: 5000 }
        );
        const endpointDefinition = smartContract.getEndpoint("getEndpointById");
        const query = smartContract.createQuery({
            func: "getEndpointById",
            args: [new U64Value(id)]
        })
        const queryResponse = await provider.queryContract(query);
        let { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

        const endpoint = {
            id,
            project: firstValue?.valueOf().project.valueOf().toString(),
            module: firstValue?.valueOf().module.valueOf().toString(),
            endpoint: firstValue?.valueOf().endpoint.valueOf().toString()
        }

        return endpoint;
    }

    async getAddressFlows(address: string): Promise<FlowType[]> {

        const provider = new ProxyNetworkProvider(
            this.gatewayUrl,
            { timeout: 5000 }
        );
        const endpointDefinition = smartContract.getEndpoint("getAddressFlows");
        const query = smartContract.createQuery({
            func: "getAddressFlows",
            args: [new AddressValue(new Address(address))]
        })
        const queryResponse = await provider.queryContract(query);
        let { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

        const flows: FlowType[] = [];
        firstValue?.valueOf().map((flow: any) => {
            const newFlow: FlowType = {
                name: flow.name.valueOf().toString(),
                label: flow.label.valueOf().toString(),
                description: flow.description.valueOf().toString(),
                steps: flow.steps.valueOf().toString()
            };
            flows.push(newFlow);
        });

        return flows;
    }

    async getFlowByAddressAndName(address: string, flowName: string): Promise<FlowType> {

        const provider = new ProxyNetworkProvider(
            this.gatewayUrl,
            { timeout: 5000 }
        );
        const endpointDefinition = smartContract.getEndpoint("getFlowByAddressAndName");
        const query = smartContract.createQuery({
            func: "getFlowByAddressAndName",
            args: [
                new AddressValue(new Address(address)),
                BytesValue.fromUTF8(flowName)
            ]
        })
        const queryResponse = await provider.queryContract(query);
        let { firstValue } = new ResultsParser().parseQueryResponse(queryResponse, endpointDefinition);

        console.log("firstValue:", firstValue);

        const flow: FlowType = {
            name: firstValue?.valueOf().name.valueOf().toString(),
            label: firstValue?.valueOf().label.valueOf().toString(),
            description: firstValue?.valueOf().description.valueOf().toString(),
            steps: firstValue?.valueOf().steps.valueOf().toString()
        };
        return flow;
    }

}

export default TurbodefiContractService;