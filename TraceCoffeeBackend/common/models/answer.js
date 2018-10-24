"use strict";

var Web3 = require("web3");

var web3 = new Web3();
var web3Http = new Web3(
    new Web3.providers.HttpProvider(
        "https://kovan.infura.io/v3/66139c047af248c58d3a61576cb5d476"
    )
);

const EthereumTx = require("ethereumjs-tx");
const privateKey = Buffer.from(
  "0f81a091c8d9af7295c5138f9c106292dc015d1e67e9a909275ab1adf3ced9b7",
  "hex"
);
const address_origin = "0xaa4f57eeb8c7c4d49701b51a00eb7a641f36c8ce";

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

async function callContract(hasSucceeded) {
  var address = "0xac133e2580dbbabcbdc8266a8702a5df25a4e934";
  var count = await web3Http.eth.getTransactionCount(address_origin);
  var trace_contract = web3Http.eth.Contract(ABI, address);

  let data = trace_contract.methods.setSucceeded(hasSucceeded).encodeABI();
  // .send({ from: "0x082376777B71F3897b68552C759d8f09D9DD1a1C" });

  const txParams = {
    nonce: count,
    gasPrice: 22000000000,
    gasLimit: 4300000,
    to: trace_contract,
    value: "0x00",
    data: data,
    chainId: 4
  };
  const tx = new EthereumTx(txParams);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();
  web3Http.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));

  console.log("contract sent");
}

module.exports = function(Answer) {
  Answer.observe("before save", function(ctx, next) {
    console.log(ctx.methodString, " was invoked remotely *************");

    var answer = ctx.instance;

    var hasSucceeded = true;
    var { answers } = answer;
    console.log("answers: ", answers);
    answers.forEach(answerData => {
      console.log("validating answer: ", answerData);
      if (answerData["questionId"].endsWith("Quality"))
        if (answerData.response[0] != "Verdadero") hasSucceeded = false;
    });

    callContract(hasSucceeded);
    next();
  });
};
