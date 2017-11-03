// try convert wechat-app-demo to ali-demo
import path from 'path'
import fs from 'fs'
import glob from 'glob'
import _ from 'lodash'

import * as utils from './utils.js'
import { defaultConvert, convertScripts, convertStyles, convertXmls, convertJsons } from './convert.js'

const cacheLoader = {}

export function generateDistPath(src) {
  const srcParse = path.normalize(src)
  const dirs = srcParse.split(path.sep).filter(dir => !!dir)
  const distDir = `${dirs[dirs.length-1]}-convert`
  return path.resolve(src, `../${distDir}`);
}

export function convert(src, dist = '') {
  console.time('convertAll')
  if (!src) throw new Error('src is null');
  if (!utils.isDir(src)) throw new Error(`src:'${src}' is not a Directory `);
  //if no dist generate new dist
  if (!dist) {
    dist = generateDistPath(src)
  }
  //create dist dir
  if (!utils.isDir(dist)) {
    utils.mkdir(dist)
  }

  utils.setDistPath(dist);

  return new Promise((resolve) => {
    const convertPath = path.resolve(src, './**/*.{js,wxml,wxss,json,png,jpg,svg,gif}')
    const notConvertPath = path.resolve(src, './npm-')
    glob(, {}, (err, files) => {
      if (err) return console.error(err)
      //copy rewriteApi.js and api/*.js to dist
      const copyTask = copyApiFile(dist);

      const extConvertMap = files.map((file) => {
          const { ext } = path.parse(file)
          return {
            ext,
            file
          }
        })
        .filter(({ ext }) => !!ext)

      const groups = _.groupBy(extConvertMap, ({ ext }) => {
        return ext
      })

      //ext:.js .wxss .wxml .json .jpg ...
      const groupTask = Object.keys(groups).map((ext) => {
        const convert = loadConvert(ext)
        const fileCollection = groups[ext]
        return convert({
          ext,
          src,
          dist,
          files: fileCollection.map(({ file }) => file)
        })
      })

      Promise.all(groupTask.concat(copyTask)).then(() => {
        console.timeEnd('convertAll')
        resolve()
      })
    })
  })
}

// copyApiFile('D:\demo-convert\')
export function copyApiFile(dist) {
  console.time('rewriteApi*')
  const apiRelateFileGlob = path.resolve(utils.cliDir, './{rewriteApi.js,/api/*.js}')
  return new Promise((resolve) => {
    glob(apiRelateFileGlob, {}, (err, files) => {
      if (err) return console.error(err)
      const copyTask = files.map(file => utils.readFilePromise(file).then(code => {
        const fileRelative = path.relative(utils.cliDir, file)
        const distFilePath = path.resolve(dist, fileRelative)
        return utils.writeFilePromse(distFilePath, code)
      }))

      Promise.all(copyTask).then(() => {
        console.timeEnd('rewriteApi*')
        resolve()
      })
    })
  })

}

export function loadConvert(ext) {
  if (cacheLoader[ext]) return cacheLoader[ext]
  switch (ext) {
    case '.js':
      return (cacheLoader[ext] = convertScripts);
    case '.wxml':
      return (cacheLoader[ext] = convertXmls);
    case '.wxss':
      return (cacheLoader[ext] = convertStyles);
    case '.json':
      return (cacheLoader[ext] = convertJsons);
    default:
      return (cacheLoader[ext] = defaultConvert);
  }
}
