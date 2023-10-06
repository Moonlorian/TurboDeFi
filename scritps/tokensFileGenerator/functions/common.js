const { Address } = require("@multiversx/sdk-core/out");
const { BigNumber } = require("bignumber.js");
const { timeout } = require("../conf/env");

const parseArrayResponse = (hexResponse, fields, inStruct) => {
  let raw = hexResponse;
  const arrayRes = [];

  if (inStruct) {
    raw = raw.slice(8);
  }

  while (raw.length > 0) {
    const { res, raw: newRaw } = parseResponseChunk(raw, fields);
    arrayRes.push(res);
    raw = newRaw;
  }

  return arrayRes;
};

const parseResponse = (hexResponse, fields) => {
  const { res } = parseResponseChunk(hexResponse, fields);
  return res;
};

const parseResponseChunk = (hexResponse, fields) => {
  let raw = hexResponse;
  const res = [];

  fields.forEach((field) => {
    let dataField = null;

    switch (field.type) {
      case "ManagedAddress":
        dataField = Address.fromHex(raw.substring(0, 64));
        raw = raw.slice(64);
        break;
      case "ManagedBuffer":
        const bufSize = parseInt(raw.substring(0, 8), 16);
        const bufEnd = 8 + bufSize * 2;
        dataField = hexToString(raw.substring(8, bufEnd));
        raw = raw.slice(bufEnd);
        break;
      case "bool":
        dataField = Boolean(hexToDecimal(raw.substring(0, 2)));
        raw = raw.slice(2);
        break;
      case "u8":
        dataField = hexToDecimal(raw.substring(0, 2));
        raw = raw.slice(2);
        break;
      case "u16":
        dataField = hexToDecimal(raw.substring(0, 4));
        raw = raw.slice(4);
        break;
      case "u32":
        dataField = hexToDecimal(raw.substring(0, 8));
        raw = raw.slice(8);
        break;
      case "usize":
        dataField = hexToDecimal(raw.substring(0, 8));
        raw = raw.slice(8);
        break;
      case "u64":
        dataField = hexToDecimal(raw.substring(0, 16));
        raw = raw.slice(16);
        break;
      case "TokenIdentifier":
        const tokenSize = parseInt(raw.substring(0, 8), 16);
        const tokenEnd = 8 + tokenSize * 2;
        dataField = hexToString(raw.substring(8, tokenEnd));
        raw = raw.slice(tokenEnd);
        break;
      case "BigUint":
        const sizeBytes = parseInt(raw.substring(0, 8), 16);
        const end = 8 + sizeBytes * 2;
        dataField = new BigNumber("0x" + (raw.substring(8, end) || "00"));
        if (field.asNumber) {
          dataField = dataField.toNumber();
        }
        raw = raw.slice(end);
        break;
      case "number":
        dataField = new BigNumber("0x" + (raw || "00"));
        if (field.asNumber) {
          dataField = dataField.toNumber();
        }
        raw = "";
        break;
      default:
        dataField = hexToString(raw);
        raw = "";
    }
    res[field.name] = dataField;
  });

  return { res, raw };
};

const hexToDecimal = (hexString) => {
  return parseInt(hexString, 16);
};
const hexToString = (hex) => {
  let rawData = hex;
  const sizeBytes = Math.floor(rawData.length / 2);
  const bytes = [];
  for (let i = 0; i < sizeBytes; i++) {
    const charCode = rawData.slice(0, 2);
    rawData = rawData.slice(2);
    bytes.push("0x" + charCode);
  }

  return Buffer.from(bytes).toString();
};

const asyncRetry = async (
  maxRetries,
  milisecondsToWaitBetweenRetries,
  callBack,
  onErrorCallBack = (err, retryNumber) => {},
  hideErrors = true
) => {
  let error = undefined;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await callBack();
      return result;
    } catch (err) {
      error = err;
      console.log("Retry number " + i);
      if (!hideErrors) {
        console.log(err);
      }
      onErrorCallBack(err, i + 1);
      await waitMiliSeconds(milisecondsToWaitBetweenRetries);
    }
  }
  return error;
};

const responseToHex = (response) =>
  Buffer.from(response, "base64").toString("hex");

const waitMiliSeconds = async (miliseconds) => {
  await new Promise((res) => setTimeout(() => res("p1"), miliseconds));
};


module.exports = {
  parseResponse,
  parseArrayResponse,
  hexToDecimal,
  hexToString,
  responseToHex,
  asyncRetry,
  waitMiliSeconds,
};

