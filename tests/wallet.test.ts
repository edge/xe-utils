import * as lib from '../lib'
import { expect } from 'chai'

const maxWallets = 1000000

describe('Wallet', () => {
  it('should always have a valid and recoverable private key', function () {
    this.timeout(0)

    for (let i = 0; i < maxWallets; i++) {
      const wallet = lib.wallet.create()

      expect(lib.wallet.validatePrivateKey(wallet.privateKey))
        .to
        .equal(true,`Invalid private key "${wallet.privateKey}" after ${i} iterations for (address: ${wallet.address})`)

      const recoveredWallet = lib.wallet.recover(wallet.privateKey)
      expect(recoveredWallet.address).to.equal(wallet.address)

      if (i > 0 && i % 10000 === 0) console.log(`Generated ${i.toLocaleString()} private keys so far`)
    }

    console.log(`Done after generating ${maxWallets.toLocaleString()} valid private keys`)
  })
})
