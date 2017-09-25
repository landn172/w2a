import { parseXML2Node, Node2XML } from '../lib/parseXML.js'

const eventAttributeMapping = {
  touchstart: 'TouchStart',
  touchmove: 'TouchMove',
  touchcancel: 'TouchCancel',
  touchend: 'TouchEnd',
  tap: 'Tap',
  longpress: 'LongPress',
  longtap: 'LongTap',
  input: 'Input',
  focus: 'Focus',
  blur: 'Blur',
  confirm: 'Confirm',
  change: 'Change',
  scrolltoupper: 'ScrollToUpper',
  scrolltolower: 'ScrollToLower',
  scroll: 'Scroll',
  markertap: 'MarkerTap',
  callouttap: 'CalloutTap',
  controltap: 'ControlTap',
  regionchange: 'RegionChange'
}

const eventAttributeRegex = new RegExp(`bind(${Object.keys(eventAttributeMapping).join('|')})(\\s*=)`, 'ig')

export function replaceAttributePromise(code) {
  return Promise.resolve(parseXML2Node(code))
    .then(node => walkNode(node))
    .then(node => Node2XML(node))
    .catch(e => console.error(e))
}

export function replaceImportXml(code) {
  // .wxml => .axml
  return code.replace(/.wxml/g, '.axml')
}

const tagReplaceMapping = {
  icon(attr, value) {
    //icon[type=circle] => icon[type=warn]
    //icon[type=info_circle] => icon[type=warn]
    if (attr === 'type') {
      switch (value) {
        case 'circle':
        case 'info_circle':
          console.warn(`<icon> is not support type = ${value}`)
          value = 'warn'
          break;
      }
    }

    return {
      [attr]: value
    }
  },
  picker(attr, value) {
    //picker[mode=^selector] => picker[mode=selector]
    if (attr === 'mode' && value !== 'selector') {
      console.warn(`<picker> is not support mode = ${value}`)
      value = 'selector'
    }
    return {
      [attr]: value
    }
  },
  map(attr, value) {
    //map[covers] => map[markers]
    if (attr === 'covers') {
      console.warn(`<map> is not support covers, please use markers`)
      attr = 'markers'
    }
    return {
      [attr]: value
    }
  },
  import (attr, value) {
    if (attr === 'src') {
      // .wxml => .axml
      value = value.replace(/.wxml/g, '.axml')
    }
    return {
      [attr]: value
    }
  },
  include(attr, value) {
    if (attr === 'src') {
      // .wxml => .axml
      value = value.replace(/.wxml/g, '.axml')
    }
    return {
      [attr]: value
    }
  }
}


function walkNode(node) {
  const { name, attribs, children, parentNode } = node

  if (node.type !== 'root' && name) {
    replaceNodeAttribute(node, parentNode)
  }

  if (children && Array.isArray(children)) {
    let i = 0
    while (i < children.length) {
      const cnode = children[i]
      walkNode(cnode, parentNode)
      i++;
    }
  }

  return node
}

function replaceNodeAttribute(node) {
  let { name, attribs, type, data } = node
  const rewriteAttr = arr2obj(Object.keys(attribs).map((attr) => {
    let key = attr
    let value = attribs[attr]
    key = replacePrefixAttribute(key)
    key = replaceEventAttribute(key)
    return replaceTagAttribute(name, key, value)
  }))
  node.attribs = rewriteAttr
  //fix parser5 serialize bug
  const nullableAttr = Object.keys(rewriteAttr).map(key => ({
    [key]: null
  })).reduce((obj, obj2) => Object.assign(obj, obj2), {})
  node['x-attribsNamespace'] = nullableAttr
  node['x-attribsPrefix'] = nullableAttr
  return node
}

function replacePrefixAttribute(code) {
  return code
    //wx:for-items => a:for
    .replace(/(wx|a):for-items/g, 'a:for')
    //wx:if => a:if
    .replace(/wx:/g, 'a:')
}

function replaceEventAttribute(code) {
  //bindtap => onTap
  return code.replace(eventAttributeRegex, (match, p1, p2) => {
    return `on${eventAttributeMapping[p1]}${p2}`
  })
}



function replaceTagAttribute(tagName, key, value) {
  const replaceFunc = tagReplaceMapping[tagName]
  if (typeof replaceFunc === 'function') {
    return replaceFunc(key, value)
  }
  return {
    [key]: value
  }
}

function arr2obj(arr) {
  return arr.reduce((obj, item) => {
    return Object.assign(obj, Array.isArray(item) ? arr2obj(item) : item)
  }, {})
}
