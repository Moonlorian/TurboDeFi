const { getApiFullGeneric } = require("./functions/api.js");
const fs = require("fs");

const path = "./json/";

const getTokenList = async () => {
  console.log("Loading full token list");
  const tokenList = await getApiFullGeneric("tokens", {
    pageSize: 1000,
    milisecondsBetweenCalls: 100,
  });

  console.log("Filtering token list")
  const filteredTokenList = tokenList.filter((token, index) => token.assets);

  if (!tokenList) return;

  console.log("Saving token list to file");
  fs.writeFileSync(path + "tokenList.json", JSON.stringify(filteredTokenList), "utf8");
};

getTokenList().then(() => console.log("Finished"));
