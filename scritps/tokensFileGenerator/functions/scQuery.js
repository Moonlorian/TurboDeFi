const {SmartContract, Address, ContractFunction} = require("@multiversx/sdk-core");
const {ProxyNetworkProvider} = require("@multiversx/sdk-network-providers");

const {gatewayUrl, timeout} = require("../conf/env.js");
const {responseToHex} = require("./common.js");

const queryContractFunction = async (
  scAddress,
  functionName,
  args = null
) => {
  const contract = new SmartContract({
    address: new Address(scAddress),
  });



  const provider = new ProxyNetworkProvider(
    gatewayUrl,
    timeout
  );

  const options = {
    func: new ContractFunction(functionName),
    address: [],
    args: args,
  };

  const query = contract.createQuery(options);
  const res = await provider.queryContract(query);

  if (res.returnCode !== "ok") {
    throw res.returnMessage;
  }

  return res.returnData.map((data) => responseToHex(data));
};


module.exports = { queryContractFunction };
