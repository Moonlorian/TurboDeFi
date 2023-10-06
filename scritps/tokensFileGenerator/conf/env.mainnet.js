//Gateway is used for interaction with SC (queries and transactions)
const gatewayUrl = "https://gateway.multiversx.com";
//Api is used for interactions with the api
const apiAddress = "https://api.multiversx.com";
//Graphql is used to do some queries that mustn't be cached
const graphAddress = "https://graph.xexchange.com/graphql";

const timeout = 5000;
const gasLimit = 15000000;
const chainID = "1";

const txBlockSize = 10;

module.exports = { gatewayUrl, apiAddress, graphAddress, timeout, gasLimit, chainID, txBlockSize, };