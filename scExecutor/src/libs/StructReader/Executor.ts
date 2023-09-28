import {
  Address,
  ContractFunction,
  SmartContract,
} from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers/out";
import DataTypeConverter from "./DataTypeConverter";
import StructReader from "./StructReader";

class Executor {
  /**
   * Executes a module endpoint in a file
   *
   * @remarks
   * endpoint can be a view or an specific endpoint
   *
   * @params
   * project: project that the execution belongs
   * module: module that has the endpoints
   * endpoint: function to execute
   *
   */
  static async exec(
    project: string,
    module: string,
    endpoint: string,
    ...ags: any
  ): Promise<any> {
    const provider = new ProxyNetworkProvider(
      "https://elrond-api-devnet.blastapi.io/9c12de34-9e4a-4a72-8f41-1042197ffe9a",
      { timeout: 5000 }
    );

    const structReader = new StructReader(project);
    const dataTypeConverter = new DataTypeConverter(
      structReader.getCustomFields()
    );
    const endpointObject = structReader.getModuleEndpoint(module, endpoint);

    const args = dataTypeConverter.argsToEndpointInput(
      endpointObject.inputs || [],
      ...ags
    );

    console.log(dataTypeConverter.generateFlatParameterList(endpointObject.outputs || []));
    

    if (endpointObject.address == "")
      throw new Error("A smart contract is needed");

    if (endpointObject.readonly) {
      const contract = new SmartContract({
        address: new Address(endpointObject.address),
      });
      const options = {
        func: new ContractFunction(endpointObject.name),
        address: [] as any,
        args,
      };
      const query = contract!.createQuery(options);
      const res = await provider!.queryContract(query);

      return res;
    } else {
    }

    return "";
  }
}

export default Executor;
