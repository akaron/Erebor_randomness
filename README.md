# output columns

* blockNo: block number on rinkeby
* blockHash: only show the corresponding int of the last 4 hex of the original blockhash
* ticket1: assume that we use a same `board` to generate winning tickets (note: the tickets are `keccak256(blockHash, ticket1)`)
* winningNumber1: `ticket1 % 16`
* ticket2: assume that we use a random number to generate `board`, and use the `board` to generate this ticket (only int of last 4 hex)
* winningNumber2: `ticket2 % 16`
