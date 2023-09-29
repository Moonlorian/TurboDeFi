import {
  AbiRegistry,
  Address,
  ResultsParser,
  SmartContract
} from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import StructReader from './StructReader';

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
    structReader: StructReader,
    module: string,
    endpoint: string,
    ...args: any
  ): Promise<any> {
    const provider = new ProxyNetworkProvider(
      'https://elrond-api-devnet.blastapi.io/9c12de34-9e4a-4a72-8f41-1042197ffe9a',
      { timeout: 5000 }
    );

    const endpointObject = structReader.getModuleEndpoint(module, endpoint);

    const abiJson = {
      endpoints: [endpointObject.toJson()],
      types: structReader.getCustomFields(true)
    };
    const legacyDelegationAbi = AbiRegistry.create(abiJson);
    if (endpointObject.address == '')
      throw new Error('A smart contract is needed');

    if (endpointObject.readonly) {
      const legacyDelegationContract = new SmartContract({
        address: new Address(endpointObject.address),
        abi: legacyDelegationAbi
      });

      //return;
      const interaction = legacyDelegationContract.methods[endpointObject.name](
        [...args]
      );
      const query = interaction.check().buildQuery();

      const res = await provider.queryContract(query);
      const typedBundle = new ResultsParser().parseQueryResponse(
        res,
        interaction.getEndpoint()
      );

      const bundleValues = [
        typedBundle.firstValue,
        typedBundle.secondValue,
        typedBundle.thirdValue
      ];
      const customFields = structReader.getCustomFields();
      const customFieldsIndex = Object.keys(customFields);
      const finalOutput: { [key: string]: any } = {};
      bundleValues.map((bundle, index) => {
        if (bundle) {
          if ((endpointObject.outputs || []).length < index)
            throw new Error('Wrong number of endpoint outputs');
          const output = (endpointObject.outputs || [])[index];
          const bundleTypeName = bundle.getType().getName();
          if (customFieldsIndex.includes(bundleTypeName)) {
            //Is a struct?

            const fields = customFields[bundleTypeName].fields || [];
            const values = bundle?.valueOf();
            if (fields.length > 0) {
              fields.map((fieldData: any) => {
                finalOutput[fieldData.name || ''] = {
                  ...fieldData,
                  value: values[fieldData.name || ''],
                  token: fieldData.balance ? endpointObject.token : ''
                };
              });
            } else {
              finalOutput[output.name || ''] = {
                ...customFields[bundleTypeName].toJson(),
                value: values.name,
                token: output.balance ? endpointObject.token : ''
              };
            }
          } else {
            //Is a single field
            finalOutput[output.name || ''] = {
              ...output,
              value: bundle?.valueOf(),
              token: output.balance ? endpointObject.token : ''
            };
          }
        }
      });

      return finalOutput;
    } else {
    }

    return '';
  }
}

export default Executor;
