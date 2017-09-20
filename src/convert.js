import path from 'path'
import fs from 'fs'

import { replaceNotCompatibleName, replaceWx2My } from '../src/script-convert.js'
import { replaceImportCss } from '../src/style-convert.js'
import { replaceImportXml, replaceAttributePromise } from '../src/xml-convert.js'
import { replaceAppJson, replacePageJson } from '../src/json-convert.js'
import * as utils from '../src/utils.js'

export function defaultConvert({ src, dist, files, ext = '' }) {
  ext = ext.replace('.', '') || 'default'
  const timeName = `${ext}`
  console.time(timeName)
  const convertPromises = mapFiles({ src, dist, files }).map(({
    opath,
    distFilePath
  }) => utils.copy(opath, distFilePath));

  return Promise.all(convertPromises)
    .then(() => console.timeEnd(timeName))
}

export function convertJsons({ src, dist, files }) {
  const ext = 'json'
  const timeName = `${ext}`
  console.time(timeName)

  const convertPromises = mapFiles({ src, dist, files }).map(({
      opath,
      distFilePath
    }) => utils.readFilePromise(opath)
    .then(code => {
      let json = JSON.parse(code)
      if (opath.base === 'app.json') {
        json = replaceAppJson(json)
      } else {
        json = replacePageJson(json)
      }

      return JSON.stringify(json, null, '\t')
    })
    .then((code) => {
      return utils.writeFilePromse(distFilePath, code)
    }));

  return Promise.all(convertPromises)
    .then(() => console.timeEnd(timeName))
}

export function convertXmls({ src, dist, files }) {
  const ext = 'axml'
  const timeName = `${ext}`
  console.time(timeName)

  const convertPromises = mapFiles({ src, dist, files }).map(({
      opath,
      distFilePath
    }) => utils.readFilePromise(opath)
    .then(code => convertXmlCodePromise(code))
    .then((code) => {
      distFilePath = distFilePath.replace('.wxml', '.axml')
      return utils.writeFilePromse(distFilePath, code)
    }));

  return Promise.all(convertPromises)
    .then(() => console.timeEnd(timeName))
}

export function convertStyles({ src, dist, files }) {
  const ext = 'acxx'
  const timeName = `${ext}`
  console.time(timeName)

  const convertPromises = mapFiles({ src, dist, files }).map(({
      opath,
      distFilePath
    }) => utils.readFilePromise(opath)
    .then(code => convertStyleCodePromise(code))
    .then((code) => {
      distFilePath = distFilePath.replace('.wxss', '.acss')
      return utils.writeFilePromse(distFilePath, code)
    }));

  return Promise.all(convertPromises)
    .then(() => console.timeEnd(timeName))
}

export function convertScripts({ src, dist, files }) {
  const ext = 'js'
  const timeName = `${ext}`
  console.time(timeName)

  const convertPromises = mapFiles({ src, dist, files }).map(({
      opath,
      distFilePath
    }) => utils.readFilePromise(opath)
    .then((code) => {
      return convertScriptCodePromise(code)
    }).then((code) => {
      if (opath.base === 'app.js') {
        code = injectRewriteApi(code)
      }
      return utils.writeFilePromse(distFilePath, code)
    }))

  return Promise.all(convertPromises)
    .then(() => console.timeEnd(timeName))
}

function mapFiles({ src, dist, files }) {
  return files.map((file) => {
    const opath = path.parse(file)
    const srcRelate = path.relative(src, file)
    const distFilePath = path.resolve(dist, srcRelate)
    return {
      opath,
      distFilePath
    }
  })
}

function injectRewriteApi(code) {
  const injectCode = `//w2a inject rewriteApi code
  require('./rewriteApi.js')`;
  return `${injectCode};\n${code}`
}

function convertStyleCodePromise(code) {
  return Promise.resolve(code)
    .then(ncode => replaceImportCss(ncode))
}

function convertXmlCodePromise(code) {
  return Promise.resolve(code)
    .then(ncode => replaceImportXml(ncode))
    .then(ncode => replaceAttributePromise(ncode))
}

function convertScriptCodePromise(code) {
  return Promise.resolve(code)
    .then(ncode => replaceNotCompatibleName(ncode))
    .then(ncode => replaceWx2My(ncode))
}
