import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import { exec } from 'child_process';

export const cliDir = __dirname
export const currentDir = process.cwd()
let distPath = './'


//TODO:解析依赖
function resolveDependence({ code, type, opath }) {
  return code.replace(/require\(['"]([\w\d_\-\.\/@]+)['"]\)/ig, (match, lib) => {
    let source = '';
    let target = '';

    //判断是否是绝对路径
    if (path.isAbsolute(lib)) {
      source = lib;
      target = getDistPath(source);
    }
  })
}

export function copy(opath, target) {
  writeFile(target, readFile(path.join(opath.dir, opath.base)));
  let readable = fs.createReadStream(path.join(opath.dir, opath.base));
  let writable = fs.createWriteStream(target);
  readable.pipe(writable);
}

export function getDistPath(source) {

}

export function setDistPath(dist) {
  distPath = dist
}

export function execPromise(cmd, quite) {
  return new Promise((resolve, reject) => {
    let fcmd = exec(cmd, (err, stdout, stderr) => {
      if (err) { reject(err); } else { resolve(stdout, stderr); }
    });
    fcmd.stdout.on('data', (chunk) => {
      !quite && process.stdout.write(chunk);
    });
    fcmd.stderr.on('data', (chunk) => {
      !quite && process.stdout.write(chunk);
    });
  });
}

export function readFile(p) {
  let rst = '';
  p = (typeof(p) === 'object') ? path.join(p.dir, p.base) : p;
  try {
    rst = fs.readFileSync(p, 'utf-8');
  } catch (e) {
    rst = null;
  }
  return rst;
}

export function readFilePromise(p) {
  let rst = '';
  p = (typeof(p) === 'object') ? path.join(p.dir, p.base) : p;
  return new Promise((resolve) => {
    fs.readFile(p, 'utf8', (err, data) => {
      if (err) {
        console.error('readFilePromise error:', p, err);
        resolve('')
      }
      resolve(data)
    });
  })
}

function isString(str) {
  return typeof str === 'string'
}

export function writeFile(p, data) {
  let opath = (isString(p) ? path.parse(p) : p);
  if (!isDir(opath.dir)) {
    mkdirp.sync(opath.dir);
  }
  fs.writeFileSync(p, data);
}

export function writeFilePromse(p, data) {
  let opath = (isString(p) ? path.parse(p) : p);
  if (!isDir(opath.dir)) {
    mkdirp.sync(opath.dir);
  }
  return new Promise((resolve) => {
    fs.writeFile(path.format(opath), data, (err) => {
      if (err) console.error('writeFilePromse error:', err);
      resolve()
    });
  })
}

export function mkdir(name) {
  let rst = true;
  try {
    fs.mkdirSync(name);
  } catch (e) {
    rst = e;
    console.log(e)
  }
  return rst;
}

export function isFile(p) {
  p = (typeof(p) === 'object') ? path.join(p.dir, p.base) : p;
  if (!fs.existsSync(p)) {
    return false;
  }
  return fs.statSync(p).isFile();
}

export function isDir(p) {
  if (!fs.existsSync(p)) {
    return false;
  }
  return fs.statSync(p).isDirectory();
}
