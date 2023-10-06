const {
  Account,
  ContractCallPayloadBuilder,
  ContractFunction,
  Transaction,
  Address,
} = require("@multiversx/sdk-core");
const { ProxyNetworkProvider } = require("@multiversx/sdk-network-providers");
const { UserSigner, parseUserKey } = require("@multiversx/sdk-wallet");

const {readFileSync} = require("fs");

const {
  gatewayUrl,
  timeout,
  txBlockSize,
  gasLimit,
  chainID,
} = require("../conf/env.js");


const execTransactionList = async (scAddress, transactionData, action, pemPath) => {
  const walletPemKey = readFileSync(pemPath, {
    encoding: "utf8",
  });
  const signer = UserSigner.fromPem(walletPemKey);

  const provider = new ProxyNetworkProvider(gatewayUrl, {
    timeout: timeout,
  });
  const userAddress = parseUserKey(walletPemKey)
    .generatePublicKey()
    .toAddress();
  const userAccount = new Account(userAddress);

  const userAccountOnNetwork = await provider.getAccount(userAccount.address);
  userAccount.update(userAccountOnNetwork);

  let counter = 0;
  const txList = [];
  return Promise.all(
    transactionData.map(async (transactionElement) => {
      const data = new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction(action))
        .setArgs(transactionElement)
        .build();

      const tx = new Transaction({
        data: data,
        gasLimit: gasLimit,
        receiver: new Address(scAddress),
        value: 0,
        chainID: chainID,
        sender: new Address(userAddress.toString()),
      });
      tx.setNonce(userAccount.getNonceThenIncrement());
      counter++;
      return signer
        .sign(tx.serializeForSigning(tx.getSender()))
        .then((sign) => {
          tx.applySignature(sign, tx.getSender());
          return tx;
        });
    })
  )
    .then(async (txPromiseList) => {
      txList.push(...txPromiseList.flat(1));
      //Make sure, tx list is not bigger than txSize:
      let round = 0;
      while (txList.length) {
        const subTx = txList.splice(0, txBlockSize);
        round++;

        
        await provider.sendTransactions(subTx).then((hash) => {
          console.log("Sent tx. Hash = ", hash);
        });
      }

      console.log("Done");

      return(txList);

    })
    .catch((msg) => {
      throw new Error("Error while making transactions:\n" + msg);
    });
};

const getAddressFromPem = (pemPath) => {
  const walletPemKey = readFileSync(pemPath, {
    encoding: "utf8",
  });
  return parseUserKey(walletPemKey).generatePublicKey().toAddress().toString();
};

module.exports = { execTransactionList, getAddressFromPem };

