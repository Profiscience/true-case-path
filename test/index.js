'use strict'

const assert = require('assert')
const path = require('path')

const {
  trueCasePath,
  trueCasePathSync
} = require('../')

const expected = path.join(__dirname, 'fixture/fOoBaR/BAZ')
const requested = expected.toLowerCase()

function testSync() {
  assert.equal(trueCasePathSync(requested), expected, 'trueCasePath.sync works')
}

function testRelative() {
  assert.equal(trueCasePathSync('test/fixture/fOoBaR/BAZ'), expected, 'trueCasePath works with relative paths')
}

function testAsync() {
  return trueCasePath(requested).then((actual) => assert.equal(actual, expected, 'trueCasePath (async) works'))
}

testSync()
testRelative()
testAsync()
  .then(() => {
    console.log('All tests passed!')
  })
  .catch((err) => {
    console.log('Test failed!')
    console.error(err)
    process.exitCode = 1
  })