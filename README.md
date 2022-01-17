<img src="https://cdn.edge.network/assets/img/edge-logo-green.svg" width="200">

# xe-utils

Utility library for XE blockchain API

[![npm version](https://img.shields.io/npm/v/@edge/xe-utils)](https://www.npmjs.com/package/@edge/xe-utils) [![npm downloads](https://img.shields.io/npm/dt/@edge/xe-utils)](https://www.npmjs.com/package/@edge/xe-utils) [![license](https://img.shields.io/npm/l/@edge/xe-utils)](LICENSE.md)

- [xe-utils](#xe-utils)
  - [Usage](#usage)
    - [On-chain variables](#on-chain-variables)
    - [Transactions](#transactions)
      - [Get transactions](#get-transactions)
      - [Get pending transactions](#get-pending-transactions)
      - [Create transactions](#create-transactions)
    - [Stakes](#stakes)
      - [Get stakes](#get-stakes)
      - [Get a stake](#get-a-stake)
    - [Wallet](#wallet)
      - [Create a wallet](#create-a-wallet)
      - [Recover a wallet](#recover-a-wallet)
      - [Get wallet balance and nonce](#get-wallet-balance-and-nonce)
      - [Validation](#validation)
    - [Request callbacks](#request-callbacks)
  - [License](#license)

## Usage

This library provides a collection of simple functions for interacting with the XE blockchain, plus attendant features.

> API functions expect a `host` URL for the blockchain API to be provided as the first argument. This must be provided without a trailing slash. The standard URLs are:
>
> - Mainnet: <https://api.xe.network>
> - Testnet: <https://xe1.test.network>
>
> All code examples use the mainnet URL for simplicity.

### On-chain variables

The XE blockchain exposes on-chain variables including staking amounts, release fee, and more. You can access these with the [core](lib/index.ts) `vars()` function:

```js
const xe = require('@edge/xe-utils')

async function main() {
  const vars = await xe.vars('https://api.xe.network')
  console.log(vars)
}

main()
```

### Transactions

The [tx](lib/tx.ts) component provides the ability to list and create transactions.

#### Get transactions

`tx.transactions()` gets a list of the most recent transactions, or transactions within a specific block range.

```js
const { tx } = require('@edge/xe-utils')

async function main() {
  let txs = await tx.transactions('https://api.xe.network')
  console.log(txs)

  txs = await tx.transactions('https://api.xe.network', { from: 159335, to: 159345 })
  console.log(txs)
}

main()
```

#### Get pending transactions

`tx.pendingTransactions()` gets a list of pending transactions, optionally for a specific wallet address.

```js
const { tx } = require('@edge/xe-utils')

async function main() {
  let txs = await tx.pendingTransactions('https://api.xe.network')
  console.log(txs)

  txs = await tx.pendingTransactions('https://api.xe.network', 'xe_ed9e05C9c85Ec8c46c333111a1C19035b5ECba99')
  console.log(txs)
}

main()
```

#### Create transactions

`tx.sign()` creates a signed transaction. `tx.createTransactions()` then submits one or more signed transactions to the blockchain.

> This is not a working example: you will need to substitute correct values for `my-wallet-address`, `other-wallet-address`, and `my-private-key`. See [Wallet](#wallet) for more on this.

```js
const { tx } = require('@edge/xe-utils')

async function main() {
  const myTx = sign({
    timestamp: Date.now(),
    sender: 'my-wallet-address',
    recipient: 'other-wallet-address',
    amount: 1e6,
    data: { memo: 'example of sending 1 XE' },
    nonce: 1
  }, 'my-private-key')

  const res = await tx.createTransactions('https://api.xe.network', [myTx])
  console.log(res)
}

main()
```

> Note that the `amount` of a transaction is specified in microXE (mXE). 1 XE is 1,000,000 mXE. If dealing in XE amounts in user code, you should multiply by 1,000,000 (1e6) when preparing a transaction to get the correct `amount`.

### Stakes

The [stake](lib/stake.ts) component provides access to on-chain staking information.

#### Get stakes

`stake.stakes()` gets a list of stakes for a specific wallet address.

> This is not a working example: you will need to substitute a correct value for `my-wallet-address`. See [Wallet](#wallet) for more on this.

```js
const { stake } = require('@edge/xe-utils')

async function main() {
  const myStakes = await stake.stakes('https://api.xe.network', 'my-wallet-address')
  console.log(myStakes)
}

main()
```

#### Get a stake

`stake.stake()` gets a stake by its hash.

> This is not a working example: you will need to substitute a correct value for `my-hash`.

```js
const { stake } = require('@edge/xe-utils')

async function main() {
  const myStake = await stake.stake('https://api.xe.network', 'my-hash')
  console.log(myStake)
}

main()
```

### Wallet

The [wallet](lib/wallet.ts) component provides standard XE wallet features, plus the underlying cryptographic functions for advanced usage.

#### Create a wallet

`wallet.create()` generates a new wallet.

```js
const { wallet } = require('@edge/xe-utils')

async function main() {
  const myWallet = wallet.create()
  console.log(myWallet)
}

main()
```

#### Recover a wallet

`wallet.recover()` recovers a wallet from a private key.

> This is not a working example: you will need to substitute a correct value for `my-private-key`. If you do not have a private key already, you may need to [create](#create-a-wallet) one instead.

```js
const { wallet } = require('@edge/xe-utils')

async function main() {
  const myWallet = wallet.recover('my-private-key')
  console.log(myWallet)
}

main()
```

#### Get wallet balance and nonce

There are two functions for getting on-chain wallet information:

- `wallet.info()` gets the current available balance and nonce
- `wallet.infoWithNextNonce()` is slightly slower, but gets the current available balance and _next_ nonce, accounting for any pending transactions

```js
const { wallet } = require('@edge/xe-utils')

async function main() {
  let info = await wallet.info('https://api.xe.network', 'xe_ed9e05C9c85Ec8c46c333111a1C19035b5ECba99')
  console.log(info)

  info = await wallet.infoWithNextNonce('https://api.xe.network', 'xe_ed9e05C9c85Ec8c46c333111a1C19035b5ECba99')
  console.log(info)
}

main()
```

#### Validation

The functions `wallet.validateAddress()` and `wallet.validatePrivateKey()` provide a simple way to validate wallet information in user code before touching the XE blockchain.

```js
const { wallet } = require('@edge/xe-utils')

async function main() {
  if (!wallet.validateAddress('invalid-wallet-address')) console.error('invalid address')
  if (!wallet.validatePrivateKey('invalid-private-key')) console.error('invalid private key')
}

main()
```

### Request callbacks

All API wrapper functions accept a `RequestCallback` as their final argument. This can be used to control request behaviour from your own code using [SuperAgent's chaining API](https://visionmedia.github.io/superagent/).

For example, if you wanted to specify a 100ms timeout on a request for transactions, you could do:

```js
const { tx } = require('@edge/xe-utils')

async function main() {
  let txs = await tx.transactions('https://api.xe.network', undefined, req => req.timeout(100))
  console.log(txs)
}
```

> Note that undefined arguments cannot be omitted, as we do not provide overloaded functions in this library. You can write your own wrapper to simplify this if you prefer.

## License

Edge is the infrastructure of Web3. A peer-to-peer network and blockchain providing high performance decentralised web services, powered by the spare capacity all around us.

Copyright notice
(C) 2021 Edge Network Technologies Limited <support@edge.network><br />
All rights reserved

This product is part of Edge.
Edge is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version ("the GPL").

**If you wish to use Edge outside the scope of the GPL, please contact us at licensing@edge.network for details of alternative license arrangements.**

**This product may be distributed alongside other components available under different licenses (which may not be GPL). See those components themselves, or the documentation accompanying them, to determine what licenses are applicable.**

Edge is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

The GNU General Public License (GPL) is available at: https://www.gnu.org/licenses/gpl-3.0.en.html<br />
A copy can be found in the file GPL.md distributed with
these files.

This copyright notice MUST APPEAR in all copies of the product!

