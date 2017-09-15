/**
 * wx.showModal => my.confirm
 */
const myConfirm = my.confirm
export default function showModal({
  title,
  content,
  showCancel,
  cancelText,
  cancelColor,
  confirmText,
  confirmColor,
  success,
  fail,
  complete,
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
