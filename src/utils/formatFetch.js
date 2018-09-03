import i18n from '../lang'

const $isError = (e, httpFailed = false) => {
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

/**
 * 按照统一格式返回异步请求
 * @param promise 要做的异步请求
 * @param onSuccess 成功时的回调(可选)
 * @returns {Promise.<TResult>}
 */
const $doRequest = (promise, onSuccess = ()=>{}) => {
  return promise.then((e) => {
      const status = $isError(e)
      if (status === 1) {
        onSuccess(e.data.response);
        return Promise.resolve({ status, result: e.data.response})
      } else {
        return Promise.reject({ status, message: i18n.t('http.' + e.data.type)})
      }
    },
    (e) => {
      const status = $isError(e, true)
      return Promise.reject({ status, message: e.message})
    }
  )
}

export default $doRequest
