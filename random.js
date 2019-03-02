'use strict';

const fs = require('fs'); 
const csv = require('csv-parser');
const ethUtils = require('ethereumjs-utils');
const _abi = require('web3-eth-abi');
const abi = new _abi.AbiCoder();

let boardFix = ethUtils.bufferToHex(ethUtils.sha256('ElevenBuckets'));
let boardRandom = ethUtils.bufferToHex(ethUtils.sha256('ElevenBuckets'));

// helper functions
let last4digits = (hash) => {  // hash is 32 bytes start with '0x'
    return parseInt(hash.slice(62), 16);
}
let last4digitsModN = (hash, n) => {  // hash is 32 bytes start with '0x'
    return parseInt(hash.slice(62), 16) % n;
}
let getTicket = (board, hash) => {
        let packed = abi.encodeParameters( [ 'bytes32', 'bytes32', ], [ board, hash ])
        return ethUtils.bufferToHex(ethUtils.keccak256(packed));
}
// let mode = (arr) => {
//     return arr.sort((a,b) =>
//           arr.filter(v => v===a).length
//         - arr.filter(v => v===b).length
//     ).pop();
// }
// let shortHex = (hex) => {
//     // return hex.substring(0, 6) + '..' + hex.slice(62);
//     // return '0x..' + hex.slice(62);
// }

// read data and output result
// let winNumbers = [];
// let winNumber = -1;
let stream = fs.createWriteStream("out.csv", {flags:'w'});
stream.write("blockNo,blockhash,ticket1,winningNumber1,ticket2,winningNumber2\n");
fs.createReadStream('blockhash3800k.txt')
.pipe(csv())
.on('data', function(data){
    try {
        //perform the operation
	if (data.blockNo % 20  === 0) {
	    boardRandom = ethUtils.bufferToHex(ethUtils.sha256(String(Math.random()) + 'ElevenBuckets'));
        }
        let ticketFix = getTicket(boardFix, data.blockhash);
        let ticketRandom = getTicket(boardRandom, data.blockhash);
        // winNumbers.push(last4digitsModN(ticketRandom, 16));
        // if (data.blockNo % 20 === 19) {
	    // // winNumber = mode(winNumbers);
	    // winNumber = winNumbers;
	    // winNumbers = [];
        // } else {
        //     winNumber = -1;
        // }

        let line = (data.blockNo + ','
                    + last4digits(data.blockhash) + ','
                    + last4digits(ticketFix) + ',' + last4digitsModN(ticketFix, 16) + ','
                    + last4digits(ticketRandom) + ',' + last4digitsModN(ticketRandom, 16));
        stream.write(line + '\n');
        // let line = (data.blockNo + ',' + data.blockhash.substring(0, 10) + ',' + last4digits(data.blockhash) + ','
        //             + boardFix.substring(0,10) + ',' + last4digitsModN(ticketFix, 16) + ','
        //             + boardRandom.substring(0, 10) + ',' + last4digitsModN(ticketRandom, 16));
        // stream.write(line + ',' + winNumber + '\n');
    }
    catch(err) {
        //error handler
        // console.trace(err);
        throw err;
    }
})
.on('end',function(){
    //some final operation
    console.log('output to out.txt');
    stream.end();
});  

