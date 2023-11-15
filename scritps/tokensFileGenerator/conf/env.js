//Gateway is used for interaction with SC (queries and transactions)
const gatewayUrl = "https://devnet-gateway.multiversx.com";
//Api is used for interactions with the api
const apiAddress = "https://devnet-api.multiversx.com";
//Graphql is used to do some queries that mustn't be cached
const graphAddress = "https://devnet-graph.xexchange.com/graphql";

const timeout = 5000;
const gasLimit = 15000000;
const chainID = "D";

const txBlockSize = 10;

module.exports = { gatewayUrl, apiAddress, graphAddress, timeout, gasLimit, chainID, txBlockSize, };