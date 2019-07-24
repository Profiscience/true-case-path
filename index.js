'use strict'

const { readdir: _readdir, readdirSync } = require('fs')
const { platform } = require('os')
const { isAbsolute } = require('path')
const { promisify: pify } = require('util')

const readdir = pify(_readdir)
const isWindows = platform() === 'win32'
const delimiter = isWindows ? '\\' : '/'

module.exports = {
  trueCasePath: _trueCasePath({ sync: false }),
  trueCasePathSync: _trueCasePath({ sync: true })
}

function getRelevantFilePathSegments(filePath) {
  return filePath.split(delimiter).filter((s) => s !== '')
}

function escapeString(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isDriveLetter(str) {
  return /[a-zA-Z]:/.test(str)
}

function matchCaseInsensitive(fileOrDirectory, directoryContents, filePath) {
  const caseInsensitiveRegex = new RegExp(
    `^${escapeString(fileOrDirectory)}$`,
    'i'
  )
  for (const file of directoryContents) {
    if (caseInsensitiveRegex.test(file)) return file
  }
  throw new Error(
    `[true-case-path]: Called with ${filePath}, but no matching file exists`
  )
}

function _trueCasePath({ sync }) {
  return (filePath, basePath) => {
    if (basePath && !isAbsolute(basePath)) {
      throw new Error(
        `[true-case-path]: basePath argument must be absolute. Received "${basePath}"`
      )
    }
    const segments = getRelevantFilePathSegments(filePath)
    if (!basePath) basePath = isAbsolute(filePath) ? '' : process.cwd()
    if (isDriveLetter(segments[0])) segments[0] = segments[0].toUpperCase()
    return sync
      ? iterateSync(basePath, filePath, segments)
      : iterateAsync(basePath, filePath, segments)
  }
}

function iterateSync(basePath, filePath, segments) {
  return segments.reduce(
    (realPath, fileOrDirectory) =>
      realPath +
      delimiter +
      matchCaseInsensitive(
        fileOrDirectory,
        readdirSync(realPath + delimiter),
        filePath
      ),
    basePath
  )
}

async function iterateAsync(basePath, filePath, segments) {
  return await segments.reduce(
    async (realPathPromise, fileOrDirectory) =>
      (await realPathPromise) +
      delimiter +
      matchCaseInsensitive(
        fileOrDirectory,
        await readdir((await realPathPromise) + delimiter),
        filePath
      ),
    basePath
  )
}
