<img src="https://cdn.edge.network/assets/img/edge-logo-green.svg" width="200">

# xe-utils

Utility library for XE blockchain API

[![npm version](https://img.shields.io/npm/v/@edge/xe-utils)](https://www.npmjs.com/package/@edge/xe-utils) [![npm downloads](https://img.shields.io/npm/dt/@edge/xe-utils)](https://www.npmjs.com/package/@edge/xe-utils) [![license](https://img.shields.io/npm/l/@edge/xe-utils)](LICENSE.md)

## Usage

This library provides a collection of simple functions for interacting with the XE blockchain.

Many functions expect a `host` URL for the network API (without trailing slash). For example, to display mainnet on-chain variables:

```js
const xe = require('@edge/xe-utils')

async function main() {
  const vars = await xe.vars('https://api.xe.network')
  console.log(JSON.stringify(vars, undefined, 2))
}

main()
```

The `vars()` function is part of the [library core](lib/index.ts). Beyond that this library is structured into functional domains:

- [stake](lib/stake.ts) provides access to on-chain staking information
- [tx](lib/tx.ts) provides the ability to list and create transactions
- [wallet](lib/wallet.ts) provides standard XE wallet capabilities, including generating new wallets, restoring existing ones, and various validation

These are available as properties of the import:

```js
const { stake, tx, wallet } = require('@edge/xe-utils')
```

More function documentation is available in the code, including usage examples.

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
