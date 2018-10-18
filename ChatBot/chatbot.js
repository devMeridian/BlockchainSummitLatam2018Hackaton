const Telegraf = require("telegraf");
const Telegram = require("telegraf/telegram");

var Web3 = require("web3");

const bot = new Telegraf("537420063:AAGOls9AjwY2emUTwx3RttcKtgbzCy5P6BU");
const telegram = new Telegram("537420063:AAGOls9AjwY2emUTwx3RttcKtgbzCy5P6BU");

// set your web3 object
var web3 = new Web3();

web3.setProvider(
  new web3.providers.WebsocketProvider("ws://kovan.infura.io/v3/ws")
);

// const EthereumTx = require('ethereumjs-tx')
// const privateKey = Buffer.from("0f81a091c8d9af7295c5138f9c106292dc015d1e67e9a909275ab1adf3ced9b7", 'hex')
// const address_origin = '0xaa4f57eeb8c7c4d49701b51a00eb7a641f36c8ce';

chatId = 0;

function registerSession(ctx) {
  chatId = ctx.chat.id;
}

bot.start(ctx => {
  console.log("started:", ctx.from.id);
  registerSession(ctx);
  return ctx.reply("Welcome to Trace.Coffee's update bot!");
});

bot.command("help", ctx => ctx.reply("Try send a sticker!"));
bot.hears("hi", ctx => {
  ctx.reply("Hey there!");
  if (chatId == 0) {
    registerSession(ctx);
  }
});
bot.on("sticker", ctx => ctx.reply("👍"));

bot.startPolling();

// set the web3 object local blockchain node
// web3.setProvider(new web3.providers.WebsocketProvider("ws://localhost:8545"));
// web3.setProvider(new web3.providers.WebsocketProvider("ws://kovan.infura.io/v3/"));
// log some web3 object values to make sure we're all connected
console.log(web3.version.api);

//  ABI - Application Binary Interface Definition for the contract that we want to interact with.

var ABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "successful",
        type: "bool"
      }
    ],
    name: "SupplyProgress",
    type: "event"
  },
  {
    constant: false,
    inputs: [
      {
        name: "successful",
        type: "bool"
      }
    ],
    name: "setSucceeded",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];
var address = "0xac133e2580dbbabcbdc8266a8702a5df25a4e934";
// var trace_contract = "0xaa4f57eeb8c7c4d49701b51a00eb7a641f36c8ce";

// now retrieve your contract object with the ABI and contract address values
var trace = new web3.eth.Contract(ABI, address);

// indefinite recursive loop to read the 'ItBlinks' event in the blink contract.
var event = trace.events
  .SupplyProgress({}, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      var msg = "Coffee supplychain update:\n";
      if (result.returnValues.successful) {
        msg += "Your coffee is one step closer to you";
      } else {
        msg += "Your money will be returned";
      }

      console.log(msg);

      if (chatId != 0) {
        telegram.sendMessage(chatId, msg);
      }
    }
  })
  .on("data", function(event) {
    console.log(event);
  })
  .on("changed", function(event) {
    console.log(event);
  })
  .on("error", console.error);
