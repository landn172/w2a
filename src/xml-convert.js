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

const iconTypeRegex = /type(?:\s)*=(?:\s)*(?:['"])(circle|info_circle)(?:['"])/g

const pickerModeRegex = /<picker(?:\s*)mode=(?:['"])(time|date)(?:['"])/g

const mapCoversRegex = /<map(?:[\s\S]*)covers="([^'"]*)"/g

export function replaceAttributePromise(code) {
  return Promise.resolve(code)
    .then(ncode => replacePrefixAttribute(ncode))
    .then(ncode => replaceEventAttribute(ncode))
    .then(ncode => replaceIconAttribute(ncode))
    .then(ncode => replacePickerAttribute(ncode))
    .then(ncode => replaceMapAttribute(ncode))
}

export function replacePrefixAttribute(code) {
  return code
    //wx:for-items => a:for
    .replace(/(wx|a):for-items/g, 'a:for')
    //wx:if => a:if
    .replace(/wx:/g, 'a:')
}

export function replaceEventAttribute(code) {
  //bindtap => onTap
  return code.replace(eventAttributeRegex, (match, p1, p2) => {
    return `on${eventAttributeMapping[p1]}${p2}`
  })
}

export function replaceIconAttribute(code) {
  //icon[type=circle] => null
  //icon[type=info_circle] => null
  return code.replace(iconTypeRegex, (match, g1) => {
    console.warn(`支付宝小程序 icon type不支持${g1}`)
    return 'type="warn"'
  })
}

export function replacePickerAttribute(code) {
  return code.replace(pickerModeRegex, (match, g1) => {
    console.warn(`支付宝小程序 picker mode不支持${g1}`)
    return `<picker mode="selector"`
  })
}

export function replaceMapAttribute(code) {
  return code.replace(mapCoversRegex, (match, g1) => {
    console.warn(`支付宝小程序 map covers不支持请用 markers`)
    return match.replace(`covers="${g1}"`, `markers="${g1}"`)
  })
}

export function replaceImportXml(code) {
  // .wxml => .axml
  return code.replace(/.wxml/g, '.axml')
}
