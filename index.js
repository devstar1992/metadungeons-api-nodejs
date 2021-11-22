const express = require('express')
const path = require('path')
const moment = require('moment')
const { HOST } = require('./src/constants')
const db = require('./src/database')
const goldSetABI = require('./abi/GoldCraftingSet_metadata.json');
const silverSetABI = require('./abi/SilverCraftingSet_metadata.json');
const mithrilSetABI = require('./abi/MithrilCraftingSet_metadata.json');
// const factorySetABI=require('./abi/SetFactory_metadata.json');
const silverAddress = "";
const goldAddress = "0xB63901F32fEc8581275632E678B52BE4764208d3";
const mithrilAddress = "";
// const factoryAddress="";

const PORT = process.env.PORT || 3001
const Web3 = require("web3");
const url = "wss://eth-rinkeby.alchemyapi.io/v2/zT6MSYFVB-ojEc0-BbokQELJKOl0YxdS";

const options = {
  timeout: 30000,
  clientConfig: {
    maxReceivedFrameSize: 100000000,
    maxReceivedMessageSize: 100000000,
  },
  reconnect: {
    auto: true,
    delay: 5000,
    maxAttempts: 15,
    onTimeout: false,
  },
};

const web3 = new Web3(new Web3.providers.WebsocketProvider(url, options));

const app = express()
  .set('port', PORT)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

// Static public files
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.send('Get ready for OpenSea!');
})

app.get('/api/gold_sets/:token_id', async function (req, res) {
  const contract = new web3.eth.Contract(goldSetABI, goldAddress);
  try {
    const info = await contract.methods.getTokenInfoSuffix(1).call();
    console.log(info);

  } catch (err) {
    console.log(err)
  }
  // const data = {
  //   'name': "Gold Crafting Set",
  //   'description':"Metadungeons Fold Crafting Set "+grade_details,
  //   'attributes': {
  //     'Grade': grade    
  //   },
  //   'image': `/images/gold_${grade}.png`
  // }
  res.send(info)
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})

// returns the zodiac sign according to day and month ( https://coursesweb.net/javascript/zodiac-signs_cs )
