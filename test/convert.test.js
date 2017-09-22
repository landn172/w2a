// try convert wechat-app-demo to ali-demo
import path from 'path'
import { readFilePromise } from '../lib/utils.js'
import { replaceAttributePromise } from '../lib/xml-convert.js'
import { convert, copyApiFile, generateDistPath } from '../lib/index.js'

const src = 'D:/Github/WeApp-Demo/'
const dist = generateDistPath(src)
convert(src)
//copyApiFile(dist)
