const fs = require("fs");
const path = "./json/";
fs.readdir(path, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  const contracts = {};
  files.forEach(function (file) {
    const projectName = file.split(".")[0];
    const jsonData = JSON.parse(fs.readFileSync(path + file, "utf8"));
    const contractsArray = getContracts(jsonData);
    contractsArray.map((contract) => {
      contracts[contract] = projectName;
    });
  });
  console.log(contracts);
  fs.writeFileSync(path + "output.json", JSON.stringify(contracts), "utf8");
});

//return JSON.parse(fs.readFileSync(this._fullStructFilePath, "utf8"));

const getContracts = (data) => {
  const contracts = [];

  Object.keys(data).map((field) => {
    const fieldValue = data[field];
    if (typeof fieldValue == "object") {
      contracts.push(...getContracts(fieldValue));
    } else if (
      typeof fieldValue == "string" &&
      field == "address" &&
      fieldValue.substring(0, 17) == "erd1qqqqqqqqqqqqq"
    ) {
      contracts.push(fieldValue);
    }
  });
  return contracts;
};
