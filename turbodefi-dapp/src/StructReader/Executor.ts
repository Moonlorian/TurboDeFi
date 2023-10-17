import {
  AbiRegistry,
  Address,
  AddressValue,
  BigUIntValue,
  ITokenTransfer,
  ResultsParser,
  SmartContract,
  StringValue,
  TokenTransfer,
  U16Value,
  U32Value,
  U64Value,
  U8Value
} from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import StructReader from './StructReader';
import StructEndpoint from './StructParts/StructEndpoint';
import { DataType, TxInfo } from './types';
import { sendTransactions } from '@multiversx/sdk-dapp/services/transactions/sendTransactions';

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
    providerUrl: string,
    chainId: string,
    structReader: StructReader,
    module: string,
    endpoint: string,
    txInfo: TxInfo,
    ...args: any
  ): Promise<any> {
    const provider = new ProxyNetworkProvider(providerUrl, { timeout: 5000 });
    const endpointObject = structReader.getModuleEndpoint(module, endpoint);

    const abiJson = {
      endpoints: [
        {
          ...endpointObject.toJson(),
          name: endpointObject.endpoint || endpointObject.name
        }
      ],
      types: structReader.getCustomFields(true)
    };
    const abi = AbiRegistry.create(abiJson);
    if (endpointObject.address == '')
      throw new Error('A smart contract is needed');

    const contract = new SmartContract({
      address: new Address(endpointObject.address),
      abi: abi
    });

    if (endpointObject.readonly) {
      const interaction = contract.methods[
        endpointObject.endpoint || endpointObject.name
      ]([...args]);
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
          if (bundleTypeName === 'List' || bundleTypeName === 'Variadic') {
            const fullName = bundle
              .getType()
              .getFullyQualifiedName()
              .split(':')
              .slice(-1)[0]
              .replace('>', '');
            const elementList = bundle.valueOf();
            finalOutput[fullName] = {
              ...output,
              token: output.token || output.balance ? endpointObject.token : '',
              value: elementList.map((values: any, index: number) => {
                if (customFieldsIndex.includes(fullName)) {
                  return {
                    ...customFields[fullName].toJson(),
                    ...output,
                    token:
                      output.token || output.balance
                        ? endpointObject.token
                        : '',

                    value: this._getDataFromStruct(
                      customFields[fullName].fields || [],
                      values,
                      endpointObject,
                      output
                    )
                  };
                } else {
                  return {
                    value: values,
                    token:
                      output.token || output.balance ? endpointObject.token : ''
                  };
                }
              })
            };
          } else if (customFieldsIndex.includes(bundleTypeName)) {
            const fields = customFields[bundleTypeName].fields || [];
            const values = bundle?.valueOf();
            finalOutput[output.name || output.label || ''] = {
              ...output,
              ...customFields[bundleTypeName].toJson(),
              value:
                fields.length > 0
                  ? this._getDataFromStruct(
                      fields,
                      values,
                      endpointObject,
                      output
                    )
                  : values.name,
              token: output.balance ? endpointObject.token : ''
            };
          } else {
            //Is a single field
            const innerObject: { [key: string]: any } = {};
            innerObject[output.name || output.label || ''] = {
              ...output,
              value: bundle?.valueOf(),
              token: output.balance ? endpointObject.token : ''
            };
            finalOutput[output.name || output.label || ''] = innerObject;
          }
        }
      });

      return finalOutput;
    } else {
      const txParams = {
        gasLimit: 30000000,
        ...txInfo
      };

      const interaction = contract.methods[
        endpointObject.endpoint || endpointObject.name
      ](this._endpointInputsToRustData(endpointObject, args))
        .withSender(new Address(txParams.address))
        .withValue(
          this._getEgldValueFromPaymentData(endpointObject, args).toString()
        )
        .withGasLimit(txParams.gasLimit)
        .withChainID(chainId);

      //TODO, check if they are NFT or ESDT tokens
      const payments = this._getEndpointPaymentData(endpointObject, args);
      if (payments.length > 0) {
        if (payments.length > 1) {
          interaction.withMultiESDTNFTTransfer(payments);
        } else {
          interaction.withSingleESDTTransfer(payments[0]);
        }
      }

      const transaction = interaction.buildTransaction();
      sendTransactions({ transactions: transaction });

      //todo
      /*
        Given an interaction:

      interaction = contract.methods.foobar([]);

      One can apply token transfers to the smart contract call, as well.

      For single payments, do as follows:

      // Fungible token 
      interaction.withSingleESDTTransfer(TokenTransfer.fungibleFromAmount("FOO-6ce17b", "1.5", 18));

      // Non-fungible token 
      interaction.withSingleESDTNFTTransfer(TokenTransfer.nonFungible("SDKJS-38f249", 1));

      For multiple payments:

      interaction.withMultiESDTNFTTransfer([
          TokenTransfer.fungibleFromAmount("FOO-6ce17b", "1.5", 18),
          TokenTransfer.nonFungible("SDKJS-38f249", 1)
      ]);
      */
    }

    return '';
  }

  private static _getDataFromStruct(
    fields: any[], // ==> List Fields object defined in the output. each field object has its owns properties and must be included
    values: any, // ==> Values of this fields, obtained from query trough abi format
    endpointObject: StructEndpoint, // ==> Endpoint that we have called
    output: DataType // Output element for this endpoint (an endpoint can have more than 1 output element)
  ): any {
    const finalOutput: { [key: string]: any } = {};
    fields.map((fieldData: any) => {
      const value = values[fieldData.name || ''];
      finalOutput[fieldData.name] = {
        ...fieldData,
        value: value.name ?? value,
        token:
          fieldData.token || fieldData.balance
            ? fieldData.token || output.token || endpointObject.token
            : ''
      };
    });
    return finalOutput;
  }

  private static _getEgldValueFromPaymentData(
    endpoint: StructEndpoint,
    args: any[]
  ): number {
    if (endpoint.payableInTokens?.length && endpoint.inputs.length > 0) {
      for (let i = 0; i < endpoint.inputs?.length; i += 2) {
        const endpointName = (endpoint.inputs[i].name ?? '').split('_')[0];
        if (!['paymentToken', 'paymentAmount'].includes(endpointName)) break;
        //In Input goes, first the amount and second goes token field
        const tokenId = args[i + 1];
        const amount = args[i];
        //If there are EGLD in the transaction, don't use as payment
        if (tokenId == 'EGLD') {
          return amount;
        }
      }
    }
    return 0;
  }

  private static _getEndpointPaymentData(
    endpoint: StructEndpoint,
    args: any[]
  ): ITokenTransfer[] {
    const paymentData: ITokenTransfer[] = [];

    if (endpoint.payableInTokens?.length && endpoint.inputs.length > 0) {
      for (let i = 0; i < endpoint.inputs?.length; i += 2) {
        const endpointName = (endpoint.inputs[i].name ?? '').split('_')[0];
        if (!['paymentToken', 'paymentAmount'].includes(endpointName)) break;
        //TODO ==> CHeck if this input is fora a fungible or non fungible token, right now, only fungible tokens are accepted
        //In Input goes, first the amount and second goes token field
        const tokenId = args[i + 1];
        const amount = args[i];
        //If there are EGLD in the transaction, don't use as payment
        if (tokenId != 'EGLD') {
          paymentData.push(
            TokenTransfer.fungibleFromAmount(tokenId, amount, 0)
          );
        }
      }
    }
    return paymentData;
  }

  private static _endpointInputsToRustData(
    endpoint: StructEndpoint,
    args: any[]
  ): any[] {
    const rustInputData: any[] = [];
    let argIndex = 0;
    endpoint.inputs?.map((input: DataType, index: number) => {
      const endpointName = endpoint.name.split('_')[0];
      if (
        !endpoint.payableInTokens?.length &&
        !['paymentToken', 'paymentAmount'].includes(endpointName)
      ) {
        if (args[index]) {
          rustInputData[index] = this._getFormattedField(
            args[index],
            input.type
          );
          argIndex = args.length > argIndex + 1 ? 0 : argIndex + 1;
        }
      }
    });
    return rustInputData;
  }

  private static _getFormattedField(field: any, type: string) {
    switch (type) {
      case 'Address':
        return new AddressValue(new Address(field));
      case 'u8':
        return new U8Value(field);
      case 'u16':
        return new U16Value(field);
      case 'u32':
        return new U32Value(field);
      case 'u64':
        return new U64Value(field);
      case 'BigUint':
        return new BigUIntValue(field);
      default:
        return new StringValue(field);
    }
  }
}

export default Executor;
