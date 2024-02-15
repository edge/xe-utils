import * as lib from '../lib'
import { expect } from 'chai'

const conversionTestCases: [number, number, string][] = [
  [1234,         0.001234, '0.001234'],
  [123456,       0.123456, '0.123456'],
  [12345600,     12.3456,  '12.345600'],
  [1234560000,   1234.56,  '1,234.560000'],
  [123456000000, 123456,   '123,456.000000'],
  [12304560,     12.30456, '12.304560']
]

describe('mXE', () => {
  it('should convert to XE correctly', () => {
    for (const [mxe, xe] of conversionTestCases) {
      const convXe = lib.xe.toXe(mxe)
      expect(convXe).to.equal(xe)
    }
  })

  it('should format correctly', () => {
    for (const [mxe, , fmt] of conversionTestCases) {
      const convFmt = lib.xe.formatMxe(mxe, true)
      expect(convFmt).to.equal(fmt)
    }
  })
})

describe('XE', () => {
  it('should convert to mXE correctly', () => {
    for (const [mxe, xe] of conversionTestCases) {
      const convMxe = lib.xe.toMxe(xe)
      expect(convMxe).to.equal(mxe)
    }
  })

  it('should format correctly', () => {
    for (const [, xe, fmt] of conversionTestCases) {
      const convFmt = lib.xe.format(xe, true)
      expect(convFmt).to.equal(fmt)
    }
  })
})
