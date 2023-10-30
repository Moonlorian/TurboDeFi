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

Yo have available all levels that you want and all fields that you need in each level. Fields without subfields structure can be of any type of data.
*/

import axios from 'axios';
import { GRAPHQL_URL } from 'config';
import {
  apiQueryMandatoryOptions,
  apiQueryOptions,
  asyncRetry,
  getOptions
} from './apiQueries';

export const getTokenListData = async (tokenList: string[]) => {
  const params = [
    buildQueryParam('identifiers', '[String!]', tokenList),
    buildQueryParam('type', 'String!', ''),
    buildQueryParam('enabledSwaps', 'Boolean', true)
  ];

  const queryName = 'tokens';

  const responseStructure = {
    balance: '',
    decimals: '',
    name: '',
    identifier: '',
    ticker: '',
    owner: '',
    assets: {
      website: '',
      description: '',
      status: '',
      pngUrl: '',
      svgUrl: '',
      __typename: ''
    },
    price: '',
    type: ''
  };
  const tokensData = await request(params, queryName, responseStructure);
  const response: { [key: string]: any } = {};
  tokenList.map((tokenName) => {
    response[tokenName] = {};
  });
  tokensData.data.data.tokens.map((tokenData: any) => {
    response[tokenData.identifier] = tokenData;
  });
  return response;
};

export const getFullPairsList = async (userOptions?: apiQueryOptions) => {
  const options: apiQueryMandatoryOptions = getOptions(userOptions);

  let currentPage = 0;
  let list = [];

  do {
    const params = [
      buildQueryParam('offset', 'Int', currentPage * options.pageSize),
      buildQueryParam('limit', 'Int', (currentPage * options.pageSize) + options.pageSize),
      buildQueryParam('state', 'String', 'Active')
    ];

    const queryName = 'pairs';

    const responseStructure = {
      liquidityPoolTokenPriceUSD: '',
      liquidityPoolToken: {
        identifier: '',
        decimals: ''
      }
    };

    const tokenList = await asyncRetry(
      options.maxRetries,
      options.milisecondsToWaitBetweenRetries,
      () => request(params, queryName, responseStructure)
    );
    list.push(...tokenList?.data.data.pairs);
  } while (list.length === options.pageSize);
  
  return list;
};

export const request = async (
  params: any[],
  queryName: string,
  responseStructure: any
) => {
  const headQuery =
    'query myQuery (' +
    params.reduce(
      (currentQuery, currentValue, index) =>
        currentQuery +
        (currentQuery != '' ? ', ' : '') +
        `$${currentValue.field}: ${currentValue.type}`,
      ''
    ) +
    ')';

  const query =
    queryName +
    '(' +
    params.reduce(
      (currentQuery, currentValue, index) =>
        currentQuery +
        (currentQuery != '' ? ', ' : '') +
        `${currentValue.field}: $${currentValue.field}`,
      ''
    ) +
    ')';

  const bodyQuery = getLevelFields(responseStructure);

  const finalQueryString = headQuery + '{\n' + query + bodyQuery + '\n}';

  const response = await axios({
    url: GRAPHQL_URL,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    data: {
      operationName: 'myQuery',
      query: finalQueryString,
      variables: getVariables(params)
    }
  });

  return response;
};

const buildQueryParam = (
  paramName: string,
  paramType: string,
  paramValue: any
) => {
  return { field: paramName, type: paramType, value: paramValue };
};

const getVariables = (data: any): { [key: string]: any } => {
  const returnData: { [key: string]: any } = {};
  data.map((dataElement: any) => {
    returnData[dataElement.field] = dataElement.value;
  });
  return returnData;
};

const getLevelFields = (data: { [key: string]: any }): string => {
  const keys = Object.keys(data);
  return (
    '{\n' +
    keys.reduce(
      (currentString, currentKey, index) =>
        currentString +
        currentKey +
        (typeof data[currentKey] === 'object' && data[currentKey] !== null
          ? getLevelFields(data[currentKey])
          : '') +
        '\n',
      ''
    ) +
    '\n}'
  );
};
