const { Address } = require("@multiversx/sdk-core/out");
const {
  ProxyNetworkProvider,
  ApiNetworkProvider,
} = require("@multiversx/sdk-network-providers");
const { apiAddress } = require("../conf/env");
const { asyncRetry, waitMiliSeconds } = require("./common");

const getApiFullGeneric = async (query, userOptions) => {
  const options = {
    maxRetries: 10,
    milisecondsToWaitBetweenRetries: 2000,
    pageSize: 20,
    milisecondsBetweenCalls: 400,
    ...userOptions,
  };

  let currentPage = 0;
  const finalArray = [];
  const provider = new ApiNetworkProvider(apiAddress);
  let list = [];

  do {
    const finalUrl =
      query +
      (query.includes("?") ? "&" : "?") +
      "from=" +
      currentPage * options.pageSize +
      "&size=" +
      options.pageSize;
    list = await asyncRetry(
      options.maxRetries,
      options.milisecondsToWaitBetweenRetries,
      () => provider.doGetGeneric(finalUrl)
    );
    finalArray.push(...list);
    currentPage++;
    await waitMiliSeconds(options.milisecondsBetweenCalls);
  } while (list.length === options.pageSize);

  return finalArray;
};

const getAllFungibleTokensOfAccount = async (
  userAddress,
  maxRetries = 10,
  milisecondsToWaitBetweenRetries = 2000
) => {
  const apiProvider = new ApiNetworkProvider(apiAddress);
  const finalBalances = [];
  let from = 0;
  let size = 20;
  let received = 0;
  do {
    const tokenList = await asyncRetry(
      maxRetries,
      milisecondsToWaitBetweenRetries,
      () =>
        apiProvider.getFungibleTokensOfAccount(new Address(userAddress), {
          from,
          size,
        })
    );
    received = tokenList.length;
    finalBalances.push(...tokenList);
    from += size;
  } while (received == size);
  return finalBalances;
};

const getAllNonFungibleTokensOfAccount = async (
  userAddress,
  maxRetries = 10,
  milisecondsToWaitBetweenRetries = 2000
) => {
  const apiProvider = new ApiNetworkProvider(apiAddress);
  const finalBalances = [];
  let from = 0;
  let size = 20;
  let received = 0;
  do {
    const tokenList = await asyncRetry(
      maxRetries,
      milisecondsToWaitBetweenRetries,
      () =>
        apiProvider.getNonFungibleTokensOfAccount(new Address(userAddress), {
          from,
          size,
        })
    );
    received = tokenList.length;
    finalBalances.push(...tokenList);
    from += size;
  } while (received == size);
  return finalBalances;
};

const getWalletBalance = async (userAddress, tokenList) => {
  const apiProvider = new ApiNetworkProvider(apiAddress);
  const egldId = "EGLD";
  const finalBalances = [];
  //First EGLD balance:
  if (tokenList.includes(egldId)) {
    const userAccount = await apiProvider.getAccount(new Address(userAddress));
    finalBalances.push({
      tokenId: egldId,
      balance: userAccount.balance.dividedBy(10 ** 18),
    });
  }

  //Now, rest of tokens:
  const tokenListWithoutEgld = tokenList.filter((data) => data !== egldId);
  if (tokenListWithoutEgld.length > 0) {
    const balances = await getAllFungibleTokensOfAccount(userAddress);
    finalBalances.push(
      ...balances
        .filter((value, index) =>
          tokenListWithoutEgld.includes(value.identifier)
        )
        .map((tokenData) => {
          return {
            tokenId: tokenData.identifier,
            balance: tokenData.balance.dividedBy(
              10 ** tokenData.rawResponse.decimals
            ),
          };
        })
    );
  }
  return finalBalances;
};

const getAllTokenData = async () => await getApiFullGeneric("tokens");

module.exports = {
  getApiFullGeneric,
  getAllFungibleTokensOfAccount,
  getAllNonFungibleTokensOfAccount,
  getWalletBalance,
  getAllTokenData,
};
