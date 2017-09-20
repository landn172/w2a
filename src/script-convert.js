// wx. => my.
export function replaceWx2My(code) {
  return code.replace(/(wx\.)/gi, 'my.')
}

// 替换 命名不兼容的api
export function replaceNotCompatibleName(code) {
  return code
    // wx.request => my.httpRequest
    .replace(/wx\.request/g, 'my.httpRequest')
    // wx.setNavigationBarTitle => my.setNavigationBar
    .replace(/wx\.setNavigationBarTitle/g, 'my.setNavigationBar')
}

// 替换 命名以及入参都不兼容
export function replaceNotCompatibleApi(code) {}
