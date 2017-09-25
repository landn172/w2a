/**
 * wx.showModal => my.confirm
 */
import { noop } from './common.js'

const myConfirm = my.confirm
export default function showModal({
  title,
  content,
  showCancel,
  cancelText,
  cancelColor,
  confirmText,
  confirmColor,
  success = noop,
  fail = noop,
  complete = noop,
}) {
  myConfirm({
    title,
    content,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    success({ confirm }) {
      success({
        confirm: confirm,
        cancel: !confirm,
      })
    },
    fail,
    complete,
  })
}
