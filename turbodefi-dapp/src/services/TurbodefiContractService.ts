import {
  Address,
  AddressValue,
  BytesType,
  BytesValue,
  EndpointDefinition,
  Field,
  FieldDefinition,
  OptionValue,
  ResultsParser,
  StringType,
  StringValue,
  Struct,
  StructType,
  Type,
  TypedValue,
  U64Value,
  VariadicValue
} from '@multiversx/sdk-core/out';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { FlowEndpointType, FlowStepType, FlowType } from 'types';
import { smartContract } from 'utils/smartContract';

class TurbodefiContractService {
  private gatewayUrl: string;

  constructor(apiUrl: string) {
    this.gatewayUrl = apiUrl;
  }

  async getEndpointById(id: number): Promise<FlowEndpointType> {
    const provider = new ProxyNetworkProvider(this.gatewayUrl, {
      timeout: 5000
    });
    const endpointDefinition = smartContract.getEndpoint('getEndpointById');
    const query = smartContract.createQuery({
      func: 'getEndpointById',
      args: [new U64Value(id)]
    });
    const queryResponse = await provider.queryContract(query);
    let { firstValue } = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    );

    const endpoint: FlowEndpointType = {
      id,
      project: firstValue?.valueOf().project.valueOf().toString(),
      module: firstValue?.valueOf().module.valueOf().toString(),
      endpoint: firstValue?.valueOf().endpoint.valueOf().toString()
    };

    return endpoint;
  }

  async getAddressFlows(address: string): Promise<FlowType[]> {
    const provider = new ProxyNetworkProvider(this.gatewayUrl, {
      timeout: 5000
    });
    const endpointDefinition = smartContract.getEndpoint('getAddressFlows');
    const query = smartContract.createQuery({
      func: 'getAddressFlows',
      args: [new AddressValue(new Address(address))]
    });
    const queryResponse = await provider.queryContract(query);
    let { firstValue } = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    );

    const flows: FlowType[] = [];
    firstValue?.valueOf().map((flow: any) => {
      const newFlow: FlowType = {
        id: flow.id.valueOf(),
        name: flow.name.valueOf().toString(),
        label: flow.label.valueOf().toString(),
        description: flow.description.valueOf().toString(),
        steps: []
      };

      if (flow.steps.valueOf().length > 0) {
        const steps: FlowStepType[] = [];
        flow.steps.valueOf().map((step: any) => {
          const newStep: FlowStepType = {
            description: step.description.toString(),
            component: '',
            componentProps: {},
            endpoints: []
          };

          if (step.endpoints.valueOf().length > 0) {
            const endpoints: FlowEndpointType[] = [];
            step.endpoints.valueOf().map((endpoint: any) => {
              const newEndpoint: FlowEndpointType = {
                id: 0,
                project: endpoint.project.toString(),
                module: endpoint.module.toString(),
                endpoint: endpoint.endpoint.toString()
              };
              endpoints.push(newEndpoint);
            });
            newStep.endpoints = endpoints;
          } else if (step.component.valueOf() != 0) {
            const component_id = step.component.valueOf().toString();
            this.getComponentName(component_id).then(
              (componentName) => (newStep.component = componentName)
            );
          }

          steps.push(newStep);
        });
        newFlow.steps = steps;
      }
      flows.push(newFlow);
    });

    return flows;
  }

  private async getComponentName(id: number): Promise<string> {
    const provider = new ProxyNetworkProvider(this.gatewayUrl, {
      timeout: 5000
    });
    const endpointDefinition = smartContract.getEndpoint('getComponentById');
    const query = smartContract.createQuery({
      func: 'getComponentById',
      args: [new U64Value(id)]
    });
    const queryResponse = await provider.queryContract(query);
    let { firstValue } = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    );

    return firstValue?.valueOf().toString();
  }

  public async getEndpointId(
    projectName: string,
    moduleName: string,
    endpointName: string
  ): Promise<number> {
    const provider = new ProxyNetworkProvider(this.gatewayUrl, {
      timeout: 5000
    });
    const struct = new StructType('TdEndpoint', [
      new FieldDefinition('project', 'project', new StringType()),
      new FieldDefinition('module', 'module', new StringType()),
      new FieldDefinition('endpoint', 'endpoint', new StringType())
    ]);

    const structuredArgs = new Struct(struct, [
      new Field(new StringValue(projectName), 'project'),
      new Field(new StringValue(moduleName), 'module'),
      new Field(new StringValue(endpointName), 'endpoint')
    ]);
    const endpointDefinition = smartContract.getEndpoint('getEndpointId');
    const query = smartContract.createQuery({
      func: 'getEndpointId',
      args: [structuredArgs]
    });
    const queryResponse = await provider.queryContract(query);
    let { firstValue } = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    );

    return firstValue?.valueOf().toString();
  }

  public async getComponentId(
    componentName: string,
  ): Promise<number> {
    const provider = new ProxyNetworkProvider(this.gatewayUrl, {
      timeout: 5000
    });

    const endpointDefinition = smartContract.getEndpoint('getComponentId');
    const query = smartContract.createQuery({
      func: 'getComponentId',
      args: [new StringValue(componentName)]
    });
    const queryResponse = await provider.queryContract(query);
    let { firstValue } = new ResultsParser().parseQueryResponse(
      queryResponse,
      endpointDefinition
    );

    return firstValue?.valueOf().toString();
  }
}

export default TurbodefiContractService;
