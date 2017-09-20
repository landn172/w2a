export function replacePrefixAttribute(code) {
  return code
    //wx:for-items => a:for
    .replace(/(wx|a):for-items/g, 'a:for')
    //wx:if => a:if
    .replace(/wx:/g, 'a:')
}

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
  scroll: 'Scroll'
}

const eventAttributeRegex = new RegExp(`bind(${Object.keys(eventAttributeMapping).join('|')})(\\s*=)`, 'ig')

export function replaceEventAttribute(code) {
  //bindtap => onTap
  return code.replace(eventAttributeRegex, function(match, p1, p2) {
    return `on${eventAttributeMapping[p1]}${p2}`
  })
}

export function replaceImportXml(code) {
  // .wxml => .axml
  return code.replace(/.wxml/g, '.axml')
}
