import { AbiRegistry, Address, ResultsParser, SmartContract, U64Value } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { SC_ADDRESS } from "config";
import { FlowEndpointType } from "pages/Flow";

class TurbodefiContractService {

    private gatewayUrl: string;

    constructor(apiUrl: string) {
        this.gatewayUrl = apiUrl;
    }

    async getEndpointById(id: number): Promise<FlowEndpointType> {

        const abi = AbiRegistry.create({
            "endpoints": [
                {
                    "name": "getEndpointById",
                    "mutability": "readonly",
                    "inputs": [
                        {
                            "name": "id",
                            "type": "u64"
                        }
                    ],
                    "outputs": [
                        {
                            "type": "TdEndpointType"
                        }
                    ]
                }
            ],
            "types": {
                "TdEndpointType": {
                    "type": "struct",
                    "fields": [
                        {
                            "name": "project",
                            "type": "bytes"
                        },
                        {
                            "name": "module",
                            "type": "bytes"
                        },
                        {
                            "name": "endpoint",
                            "type": "bytes"
                        }
                    ]
                }
            }
        });

        const provider = new ProxyNetworkProvider(
            this.gatewayUrl,
            { timeout: 5000 }
        );
        const endpointDefinition = abi.getEndpoint("getEndpointById");
        const contract = new SmartContract({
            address: new Address(SC_ADDRESS),
            abi: abi
        });
        const query = contract.createQuery({
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
}

export default TurbodefiContractService;