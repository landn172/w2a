import { noop } from './common.js'

const myShowToast = my.showToast

/**
 * wx.showToast => my.showToast
 * @param  {[type]} options.title    [description]
 * @param  {String} options.icon     [description]
 * @param  {[type]} options.duration [description]
 * @param  {[type]} options.success  [description]
 * @param  {[type]} options.fail     [description]
 * @param  {[type]} options.complete [description]
 * @return {[type]}                  [description]
 */
export default function showToast({
  title,
  icon = 'loading', //success,loading
  duration,
  success = noop,
  fail = noop,
  complete = noop
}) {
  const typeOpts = ['success', 'fail', 'exception', 'none']
  myShowToast({
    content: title,
    type: typeOpts.indexOf(icon) >= 0 ? typeOpts : 'none',
    duration,
    success,
    fail,
    complete
  })
}
