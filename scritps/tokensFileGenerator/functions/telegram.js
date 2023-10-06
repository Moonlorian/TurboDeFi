const axios = require("axios");

//"%0A" ==> return

exports.sendMsg = async (telegramApiKey, telegramChatId, msg) => {
  const url =
    "https://api.telegram.org/" + telegramApiKey + "/sendMessage?parse_mode=markdown&chat_id=" + telegramChatId + "&text=";
  let finalMsg = msg;
  finalMsg = finalMsg.replaceAll("_", "-");
  if (msg.length > 1023){
    finalMsg = finalMsg.replaceAll("*", "-");
  }
  //const finalUrl = url + msg.replaceAll("_", ".").substring(0, 1023);
  //axios.get(finalUrl);
  const finalMsgList = finalMsg.match(/.{1,1024}/g);
  finalMsgList.map((splittedMsg) => {
    const finalUrl = url + splittedMsg;
    axios.get(finalUrl);
  })
};
