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
    const info = await contract.methods.getTokenInfoSuffix(req.params.token_id).call();
    console.log(info);
    console.log(info.grade);
    const grade = info.grade == 0 ? "C" : info.grade == 1 ? "B" : "A";
    const data = {
      'name': "Gold Crafting Set",
      'description': "Metadungeons " + info.grade == 0 ? "Small Gold Crafting Set" : info.grade == 1 ? "Standard Gold Crafting Set" : "Deluxe Gold Crafting Set",
      'attributes': {
        'Grade': grade
      },
      'image': `http://167.172.46.136/images/gold_${grade}.png`
    }

    res.json(data)
  } catch (err) {
    console.log(err)
    res.send(err)
  }

});

app.get('/api/silver_sets/:token_id', async function (req, res) {
  const contract = new web3.eth.Contract(silverSetABI, silverAddress);
  try {
    const info = await contract.methods.getTokenInfoSuffix(req.params.token_id).call();
    console.log(info);
    console.log(info.grade);
    const grade = info.grade == 0 ? "C" : info.grade == 1 ? "B" : "A";
    const data = {
      'name': "Silver Crafting Set",
      'description': "Metadungeons " + info.grade == 0 ? "Small Silver Crafting Set" : info.grade == 1 ? "Standard Silver Crafting Set" : "Deluxe Silver Crafting Set",
      'attributes': {
        'Grade': grade
      },
      'image': `http://167.172.46.136/images/gold_${grade}.png`
    }

    res.json(data)
  } catch (err) {
    console.log(err)
    res.send(err)
  }

})

app.get('/api/mithril_sets/:token_id', async function (req, res) {
  const contract = new web3.eth.Contract(mithrilSetABI, mithrilAddress);
  try {
    const info = await contract.methods.getTokenInfoSuffix(req.params.token_id).call();

    const grade = info.grade == 0 ? "C" : info.grade == 1 ? "B" : info.grade == 2 ? "A" : "S";
    const data = {
      'name': "Mithril Crafting Set",
      'description': "Metadungeons " + info.grade == 0 ? "Small Mithril Crafting Set" : info.grade == 1 ? "Standard Mithril Crafting Set" : info.grade == 2 ? "Deluxe Mithril Crafting Set" : "Royal Mithril Crafting Set",
      'attributes': {
        'Grade': grade
      },
      'image': `http://167.172.46.136/images/mithril_${grade}.png`
    }

    res.json(data)
  } catch (err) {
    console.log(err)
    res.send(err)
  }

});

app.get('/api/factory/:option_id', async function (req, res) {
  let data;
  if(req.params.option_id==0){
    data = {
      'name': "Metadungeons Silver Pack Sale",
      'description': "Metadungeons Silver Pack Sale",
      'image': `http://167.172.46.136/images/pack_silver.png`
    }
  }else if(req.params.option_id==1){
    data = {
      'name': "Metadungeons Gold Pack Sale",
      'description': "Metadungeons Gold Pack Sale",
      'image': `http://167.172.46.136/images/pack_gold.png`
    }
  }else{
    data = {
      'name': "Metadungeons Mithril Pack Sale",
      'description': "Metadungeons Mithril Pack Sale",
      'image': `http://167.172.46.136/images/pack_mithril.png`
    }
  }



  res.json(data)


})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
})

// returns the zodiac sign according to day and month ( https://coursesweb.net/javascript/zodiac-signs_cs )
