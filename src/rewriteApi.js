/**
 * 支付宝内测 版本
 */
import showModal from './api/showModal.js'
import showToast from './api/showToast.js'
import login from './api/login.js'
import requestPayment from './api/requestPayment.js'
import getUserInfo from './api/getUserInfo.js'

const oldPage = Page
const oldApp = App

my.showToast = showToast
my.showModal = showModal
my.login = login
my.getUserInfo = getUserInfo
my.requestPayment = requestPayment



