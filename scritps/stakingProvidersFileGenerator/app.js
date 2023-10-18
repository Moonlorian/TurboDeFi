'use strict'

const Fs = require('fs')  
const Path = require('path')  
const Axios = require('axios')

async function downloadFile (url, destName) {

  const path = Path.resolve(__dirname, 'json', destName + '.json')

  // axios image download with response type "stream"
  const response = await Axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  })

  // pipe the result stream into a file on disc
  response.data.pipe(Fs.createWriteStream(path))

  // return a promise and resolve when download finishes
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve()
    })

    response.data.on('error', () => {
      reject()
    })
  })

}

async function Main(){
    await downloadFile('https://devnet-delegation-api.multiversx.com/providers', 'delegators.devnet.json');
    await downloadFile('https://delegation-api.multiversx.com/providers', 'delegators.mainnet.json');
}

Main();