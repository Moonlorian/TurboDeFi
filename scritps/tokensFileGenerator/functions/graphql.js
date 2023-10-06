const axios = require("axios");
const { graphAddress } = require("../conf/env.js");

/*
params format:
[
  {
    field:"field1Name",
    type: "field1Type",
    value: field1Value
  },
  {
    field:"field2Name",
    type: "field2Type",
    value: field2Value
  },
]

type examples:
String, String!, [String], [String!], boolean...
More information in: https://graphql.org/learn/schema/

queryName: String

responseStructure:
{
  level1_field1:"",
  level1_field2:"",
  level1_field3:{
    level2_field1:"",
    level2_field2:{
      level3_field1:""
    },
    level2_field3:""
  },
  level1_field4:""
}

Yo have available all levels that you want and all fields that you need in each leel. Fields without subfields structure can be of any type of data.
*/

const request = async (params, queryName, responseStructure) => {
  const headQuery =
    "query myQuery (" +
    params.reduce(
      (currentQuery, currentValue, index) =>
        currentQuery +
        (currentQuery != "" ? ", " : "") +
        `$${currentValue.field}: ${currentValue.type}`,
      ""
    ) +
    ")";

  const query =
    queryName +
    "(" +
    params.reduce(
      (currentQuery, currentValue, index) =>
        currentQuery +
        (currentQuery != "" ? ", " : "") +
        `${currentValue.field}: $${currentValue.field}`,
      ""
    ) +
    ")";

  const bodyQuery = getLevelFields(responseStructure);

  const finalQueryString = headQuery + "{\n" + query + bodyQuery + "\n}";
  
  const response = await axios({
    url: graphAddress,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: {
      operationName: "myQuery",
      query: finalQueryString,
      variables: getVariables(params),
    },
  })
  
  return response;  
};

const getTokenListData = async (tokenList) => {
  const params = [
    buildQueryParam("identifiers", "[String!]", tokenList),
    buildQueryParam("type", "String!", ""),
    buildQueryParam("enabledSwaps", "Boolean", true),
  ];
  
  const queryName = "tokens";
  
  const responseStructure = {
    balance:"",
    decimals:"",
    name:"",
    identifier:"",
    ticker:"",
    owner:"",
    assets:{
        website:"",
        description:"",
        status:"",
        pngUrl:"",
        svgUrl:"",
        __typename:"",
    },
    price:"",
    type:"",
  };
  const response = await request(params, queryName, responseStructure);
  return response.data.data.tokens;
};

const buildQueryParam = (paramName, paramType, paramValue) => {
  return { field: paramName, type: paramType, value: paramValue };
};

const getVariables = (data) => {
  const returnData = {};
  data.map((dataElement) => {
    returnData[dataElement.field] = dataElement.value;
  });
  return returnData;
};

const getLevelFields = (data) => {
  const keys = Object.keys(data);
  return (
    "{\n" +
    keys.reduce(
      (currentString, currentKey, index) =>
        currentString +
        currentKey +
        (typeof data[currentKey] === "object" && data[currentKey] !== null
          ? getLevelFields(data[currentKey])
          : "") +
        "\n",
      ""
    ) +
    "\n}"
  );
};

module.exports = { request, getTokenListData };
