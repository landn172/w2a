const tradePay = my.tradePay

const RESULT_CODE_MESSAGE = {
  9000: '订单支付成功',
  8000: '正在处理中',
  4000: '订单支付失败',
  6001: '用户中途取消',
  6002: '网络连接出错',
  99: '用户点击忘记密码导致快捷界面退出(only iOS)'
}

export default function requestPayment({
  orderStr,
  success,
  fail,
  complete
}) {
  tradePay({
    orderStr,
    success({ resultCode }) {
      success(formatResultCode2ErrMsg(resultCode))
    },
    fail({ resultCode }) {
      fail(formatResultCode2ErrMsg(resultCode))
    },
    complete({ resultCode }) {
      complete(formatResultCode2ErrMsg(resultCode))
    }
  })
}

function formatResultCode2ErrMsg(resultCode) {
  return {
    errMsg: RESULT_CODE_MESSAGE[resultCode] || resultCode
  }
}
