import {
  AbiRegistry,
  Address,
  ResultsParser,
  SmartContract
} from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import StructReader from './StructReader';
import StructEndpoint from './StructParts/StructEndpoint';

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
          if (bundleTypeName === 'List') {
            const fullName = bundle
              .getType()
              .getFullyQualifiedName()
              .split(':')
              .slice(-1)[0]
              .replace('>', '');
            const fields = customFields[fullName].fields || [];
            const elementList = bundle.valueOf();
            elementList.map((values: any, index: number) => {
              Object.assign(
                finalOutput,
                this._getDataFromStruct(
                  fields,
                  values,
                  endpointObject,
                  '_' + index.toString()
                )
              );
            });
          } else if (customFieldsIndex.includes(bundleTypeName)) {
            const fields = customFields[bundleTypeName].fields || [];
            const values = bundle?.valueOf();
            if (fields.length > 0) {
              Object.assign(
                finalOutput,
                this._getDataFromStruct(fields, values, endpointObject, '')
              );
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

  private static _getDataFromStruct(
    fields: any[],
    values: any,
    endpointObject: StructEndpoint,
    prefix = ''
  ): any {
    const finalOutput: { [key: string]: any } = {};
    fields.map((fieldData: any) => {
      const value = values[fieldData.name || ''];
      finalOutput[fieldData.name + prefix] = {
        ...fieldData,
        value: value.name ?? value,
        token: fieldData.balance ? endpointObject.token : ''
      };
    });
    return finalOutput;
  }
}

export default Executor;
