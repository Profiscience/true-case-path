'use strict'

const assert = require('assert')
const path = require('path')

const trueCasePath = require('../')

const expected = path.join(__dirname, 'fixture/fOoBaR/BAZ')
const requested = expected.toLowerCase()

async function test() {
  assert.equal(trueCasePath(requested), expected, 'trueCasePath.sync works')
  // assert.equal(await trueCasePath(requested), expected, 'trueCasePath (async) works')
}

test()
  .then(() => {
    console.log('All tests passed!')
  })
  .catch((err) => {
    console.log('Test failed!')
    console.error(err)
    process.exitCode = 1
  })