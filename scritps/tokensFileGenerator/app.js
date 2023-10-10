const { getApiFullGeneric } = require("./functions/api.js");
const fs = require("fs");

const path = "./json/";

const getTokenList = async () => {
  console.log("Loading full token list");
  const tokenList = await getApiFullGeneric("tokens", {
    pageSize: 1000,
    milisecondsBetweenCalls: 100,
  });

  console.log("Filtering token list");
  //const filteredTokenList = tokenList.filter((token, index) => true);
  const filteredTokenList = tokenList.map((token, index) => {
    return {
      name: token?.name || "",
      identifier: token?.identifier || "",
      ticker: token?.ticker || "",
      decimals: token?.decimals || "",
      assets: { svgUrl: token?.assets?.svgUrl || "" },
    };
  });

  filteredTokenList.unshift({
    name: "EGLD",
    identifier: "EGLD",
    ticker: "EGLD",
    decimals: 18,
    assets: { svgUrl: "https://raw.githubusercontent.com/ElrondNetwork/assets/master/tokens/WEGLD-bd4d79/logo.svg" },
  });
  if (!tokenList) return;

  console.log("Saving token list to file");
  fs.writeFileSync(
    path + "tokenList.json",
    JSON.stringify(filteredTokenList),
    "utf8"
  );
};

getTokenList().then(() => console.log("Finished"));
