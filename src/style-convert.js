export function replaceImportCss(code) {
  // import 'xx.wxss' => import 'xx.acss'
  return code.replace(/.wxss/g, '.acss')
}
