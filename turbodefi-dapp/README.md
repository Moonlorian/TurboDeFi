# @moonlorian/turbodefi-dapp

The main goal of this dapp is to provide to the users a place where interact with main multiversx's projects without enter in each project dapp one by one.

## Configure DAPP

The dapp config files are stored in the src/config folder. Dapp uses index.ts file to load configuration. To deploy the dapp in mainnet, devnet or testnet, just copy the right file content to index.ts

This are config fields:

- contractAddress ==> Address to the contract where flows and project data are stored
- API_URL ==> URL to multiversx API
- GATEWAY_URL ==> URL to multiversx gateway
- EXPLORER_URL ==> URL to multiversx explorer
- GRAPHQL_URL ==> URL to multiversx graphql instance
- CHAIN_ID ==> Chain ID depending on the environment
- sampleAuthenticatedDomains ==> Domains used to authenticate the dapp in the Axios interceptor component
- environment ==> Environment where dapp are going to be executed
- turbodefiAddress ==> Addres of the turbodefi owner. Used to configure new flows and other dapp data
- projectContractList ==> A list of smart contract with aproject name associated to be used in the scanner section
- ProjectList ==> Project availables in this environment.

## Projects

To make possible that daps understand contracts information are neccesary a json files similar to ABI files but with some differences:

- This structure is designed to store a project in each file.
- Each project can has several modules.
- Inside a module can be a group list
- Each module can has several endpoints.
- Each endpoint can belongs to a group
- Almost every components have a name, description and a label
- Name is identifies the component
- Label is the beauty and user friendly component name

A project can interact with one or more smart contract and use one or more tokens in this queries and interactions. This token can be specified at project level, module level, interaction level or, in the case of the token, at input/output level. 
When an endpoint is executed, will take its smart contract if is defined, if not, will take module smart contract and, if module is neither defined, will take project smart contract.
Tokens follow same logic as smart contracts, but, when will need a token?. In the output we introduce field "balance". When a query is executed, if there is a balance field present in output, dapp will find which token this balance is.

Furthermore, there are more differences, let's check each part separately:

### project
```
  "project": {
    "name": "project name",
    "description": "project description",
    "label": "user friendly name",
    "token": "main token for this project",
    "address": "main smart contract for this project",
    "url": "Main project url"
  }
```

### module
```
{
      "name": "module name",
      "description": "module description",
      "label": "user fiendly name",
      "token": "module main token",
      "address": "module smart contract",
      "groups": [],
      "endpoints": []
}
```

### group

Inside a module there is an array that can contain groups. This field is optional. 
```
{
    "name": "Group name",
    "label": "User friendly group name"
}
```

### endpoint

Inside a module there is an array that contain endpoints. Each one can contain a group name that has been specified in its module
```
{
    "name": "endpoint name",
    "description": "endpoint description",
    "label": "user friendly endpoint ",
    "mutability": "readonly",
    "group": "endpoint group",
    "token": "endpoin token",
    "address": "endpoint address",
    "buttonLabel": "Stake",
    "inputs": [
    {
        "name": "input name",
        "label": "input label",
        "type": "input type"
    }
    ],
    "outputs": [
    {
        "type": "UserInfo"
    }
    ]
}
```
The endpoint can have several inputs and several outputs. The "mutability" field tell us if this endpoint is "readonly" (query). In any other case, this endpoint will be considered as a interaction. To execute and endpoint user has to click in a button. The label for this button is defined in "buttonLabel" field.
Inputs can have a default value and and a fixed value. :

```
    ...
    "defaultValue": "insert here default value,
    "fixedValue": true,
    ...
```
The type fileds are equal to type fields in ABI files. It supports complex values. If an input has a token field, only this token field will be alloed to use. In any other case, for token fields, the endpoint-module-project token will be taken as default token.



As said before, an output fields can be a token balance. Balance is a boolean field that belongs to oputput:

```
    ...
    "balance": true,
    ...
```
Furthermore, output can be hidden:
```
    ...
    "hidden": true,
    ...
```

For complex types, in the json file there is a section called "types" at same level that project label. This types are equal to the types defined ABI files but other fields can be added:
- "balance" field to specify with field must show a token balance.
- "hidden" field to hide this field in output

Some interactios requires that a payment be made. In the interaction you must specify wich token are allowed. Use an * to allow any available token. If endpoints need to receive more than one token, specify here all the tokens that are going to be sent.
```
"payableInTokens": [
    "Token-id"
],
```

## Json files

This dapp uses some external data. To avoid make a lot of requests to mvx environment, there are deployed some bots that get this information once every certain time, and stores it in json files. [More information here](https://github.com/Moonlorian/TurboDeFi/tree/main/scritps).

- [Tokens information](https://github.com/Moonlorian/TurboDeFi/tree/main/scritps/tokensFileGenerator)
- [Smart contract names](https://github.com/Moonlorian/TurboDeFi/tree/main/scritps/jsonSCExtractor)
- [Staking providers information](https://github.com/Moonlorian/TurboDeFi/tree/main/scritps/stakingProvidersFileGenerator)

To configure smart contract names is neccesary to copy all the content of the file generated by the (smart contract name extractor)[https://github.com/Moonlorian/TurboDeFi/tree/main/scritps/jsonSCExtractor] and paste inside the projectContractList constant in the proper configuration file.

For example, the script generates a file with this content in mainnet:

```
{
    'erd1qqqqq......': 'name 1',
    'erd1qqqqq......': 'name 2',
    ...
}
```

It must be pasted inside mainnet configuration file inside the projectContractList constant:

```
....
export const projectContractList: { [key: string]: string } = {
    'erd1qqqqq......': 'name 1',
    'erd1qqqqq......': 'name 2',
    ...
};
```

And do not forget to copy the content of this file to the index file in order to activate this configuration.

# Dapp sections

## Flows

Flows are this actions that users do chained. First claim rewards, then swap them, etc. Turbodefi has defined default flows and users can create their own flows.

## Projects

Turbodefi has configured several projects. Inside each project functionalities has been separated in modules. Each module has it owns endpoints (claim rewards, check balance, etc..).
Users can explore this projects or add them to a flow.

## Scanner

With this utility, users can see their last interactions with any smart contract. Each smart contract appears only once and information is only from last week from the begining. But users can change this period and see older transactions.
To get more information about interactions with an specific smart contract, just click on it and all transactions will appear

## Swap & Stake

Some applications are essential. One example are swap tokens and stake them in a delegator provider. This components can be used outside a flow because they don't belong to a specific proyect and they are very usefull.
