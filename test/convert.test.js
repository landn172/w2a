// try convert wechat-app-demo to ali-demo
import { convert, copyApiFile, generateDistPath } from '../lib/index.js'

const src = 'D:/Github/WeApp-Demo/'
const dist = generateDistPath(src)
convert(src)
//copyApiFile(dist)
