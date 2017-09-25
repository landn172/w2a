import { noop } from './common.js'

const getAuthCode = my.getAuthCode

export default function login({
  success = noop,
  fail = noop,
  complete = noop
}) {
  getAuthCode({
    success({
      authCode,
      authErrorScope = {}, //Key-Value
      authSucessScope = [] //Array
    }) {
      if (authSucessScope.length === 0) {
        return fail
      }
      const successScopes = authSucessScope.join(',')
      const errorScopes = Object.keys(authErrorScope)
        .map(scope => `scope:${authErrorScope[scope]}`).join(',')

      success({
        code: authCode,
        errMsg: `成功授权${successScopes},失败授权${errorScopes}`
      })
    },
    fail,
    complete,
  })
}
