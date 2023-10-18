# @moonlorian/turbodefi-dapp

The main goal of this dapp is to provide to the users a place where interact with main multiversx's projects without enter in each project dapp one by one.

## Flows
Flows are this actions that users do chained. First claim rewards, then swap them, etc. Turbodefi has defined default flows and users can create their own flows. 

## Projects
Turbodefi has configured several projects. Inside each project functionalities has been separated in modules. Each module has it owns endpoints (claim rewards, check balance, etc..).
Users can explore this projects or add them to a flow.

## Scanner
With this utility, users can see their last interactions with any smart contract. Each smart contract appears only once and information is only from last week from the begining. But users can change this period and see older transactions.
To get more information about interactions with an specific smart contract, just click on it and all transactions will appear

## Swap && Stake
Some applications are essential. One example are swap tokens and stake them in a delegator provider. This components can be used outside a flow because they don't belong to a specific proyect and they are very usefull.

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
