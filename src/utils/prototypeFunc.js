import ElementUI from 'element-ui'
import i18n from '../lang'

export default {
  install (Vue, options) {
    Vue.prototype.$isError = (e, httpFailed = false) => {
      /*
      -1: 请求超时
      0: 一般错误
      1: 成功
      2: 登录超时
      3: 请求失败错误
       */
      if (!httpFailed) {
        if (typeof (e.data.status) === 'undefined') {
          return 0
        } else {
          return e.data.status
        }
      } else {
        if (e.status === '-1') {
          return -1
        } else {
          return 3
        }
      }
    }

    Vue.prototype.$messageType = {
      success: 'success',
      error: 'error',
      info: 'info',
      warning: 'warning'
    }

    Vue.prototype.$showErrorType = {
      message: 'message',
      notice: 'notice',
      messageBox: 'messageBox',
      none: 'none'
    }

    Vue.prototype.$showMessage = (status, message, showType) => {
      const typeColor = status === 1 ? 'success' : 'error'
      const typeText = status === 1 ? 'common.success' : 'common.error'
      switch (showType) {
        case 'message':
          ElementUI.Message({
            type: typeColor,
            message: message
          })
          break
        case 'notice':
          ElementUI.Notify({
            title: i18n.t(typeText),
            message: message
          })
          break
        case 'messageBox':
          ElementUI.Alert(message, i18n.t(typeText), {
            confirmButtonText: i18n.t('confirm')
          })
          break
      }
    }

    Vue.prototype.$resolveResponse = (actionText, status, message, showType) => {
      switch (status) {
        case 1:
          // 请求成功
          Vue.prototype.$showMessage(1, message, showType)
          break
        case -1:
          // 请求超时
          break
        case 2:
          // 登录超时
          // TODO: 做登出操作
          Vue.prototype.$showMessage(0, message, showType)
          break
        case 0:
          // 一般错误
          Vue.prototype.$showMessage(0, message, showType)
          break
        case 3:
          // 请求失败
          break
      }
    }

    /**
     * 请求的封装,包含了response校验以及提示,返回promise
     * @param promise
     * @param actionText
     * @param successShowType
     * @param errorShowType
     */
    Vue.prototype.$doRequest = (promise, actionText, successShowType = 'message', errorShowType = 'message') => {
      return new Promise((resolve, reject) => {
        promise.then((e) => {
          const status = Vue.prototype.$isError(e)
          if (status === 1) {
            Vue.prototype.$resolveResponse(actionText, 1, actionText + i18n.t('common.success'), successShowType)
            // 请求成功时, 只返回response中的内容
            resolve(e.data.response)
          } else {
            Vue.prototype.$resolveResponse(actionText, status, i18n.t('http.' + e.data.type), errorShowType)
            reject(e)
          }
        },
        (e) => {
          const status = Vue.prototype.$isError(e, true)
          // TODO: 错误信息需要再确认
          Vue.prototype.$resolveResponse(actionText, status, e.message, errorShowType)
          reject(e)
        })
      })
    }

    /**
     * 生成uuid
     * @returns {string}
     */
    Vue.prototype.$uuid = () => {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
    },

    Vue.prototype.$formatMessage = (response, actionText, successShowType = 'message', errorShowType = 'message') => {
      const { status, message } = response;
      if (status === 1) {
        Vue.prototype.$resolveResponse(actionText, 1, actionText + i18n.t('common.success'), successShowType)
      } else {
        Vue.prototype.$resolveResponse(actionText, status, message, errorShowType)
      }
    }
  }
}
