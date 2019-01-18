'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { promisify: pify } = require('util')

const readdir = pify(fs.readdir)
const isWindows = os.platform() === 'win32'
const delimiter = isWindows ? '\\' : '/'

module.exports = {
  trueCasePath,
  trueCasePathSync
}

function getFilePathSegments(filePath) {
  return path.resolve(process.cwd(), filePath).split(delimiter).filter((s) => s !== '')
}

function escapeString(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchCaseInsensitive(fileOrDirectory, directoryContents, filePath) {
  const caseInsensitiveRegex = new RegExp(`^${escapeString(fileOrDirectory)}$`, 'i')
  for (const file of directoryContents) {
    if (caseInsensitiveRegex.test(file)) {
      return file
    }
  }
  throw new Error(`[true-case-path]: Called with ${filePath}, but no matching file exists`)
}

async function trueCasePath(filePath) {
  const segments = getFilePathSegments(filePath)
  let realPath = ''
  if (isWindows) {
    realPath += segments.shift().toUpperCase() // drive letter
  }
  for (const fileOrDirectory of segments) {
    const contents = await readdir(realPath + delimiter)
    const realCaseFileOrDirectory = matchCaseInsensitive(fileOrDirectory, contents, filePath)
    realPath += delimiter + realCaseFileOrDirectory
  }
  return realPath
}

function trueCasePathSync(filePath) {
  const segments = getFilePathSegments(filePath)
  let realPath = ''
  if (isWindows) {
    realPath += segments.shift().toUpperCase() // drive letter
  }
  for (const fileOrDirectory of segments) {
    const contents = fs.readdirSync(realPath + delimiter)
    const realCaseFileOrDirectory = matchCaseInsensitive(fileOrDirectory, contents, filePath)
    realPath += delimiter + realCaseFileOrDirectory
  }
  return realPath
}