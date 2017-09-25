import { noop } from './common.js'
import { fetchUserInfoShare } from './external.js'

const getAuthUserInfo = my.getAuthUserInfo

export default function getUserInfo({
  withCredentials,
  lang,
  success = noop,
  fail = noop,
  complete = noop
}) {
  new Promise(resolve => {
    if (withCredentials) {
      my.getAuthCode({
        scopes: 'auth_user',
        success(res) {
          if (res.authCode) {
            fetchUserInfoShare(res.authCode, (userInfo) => {
              if (userInfo) {
                success(userInfo)
              } else {
                resolve()
              }
            })
          } else {
            resolve()
          }
        },
        fail
      })
    } else {
      resolve()
    }
  }).then(() => {
    getAuthUserInfo({
      success({ nickName, avatar }) {
        success({
          userInfo: {
            nickName,
            avatar
          }
        })
      },
      fail,
      complete
    })
  })
}
