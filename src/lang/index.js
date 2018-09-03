import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: {
    http: {
      'GET_WRONG_PARAM': 'wrong parameters'
    },
    message: {
      greet: 'good luck'
    },
    validation: {
      require: 'Please enter the',
      characters: 'characters',
      checkPass: 'Please enter the password again',
      passDiff: 'Different Passwords'
    },
    common: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      cancel: 'Cancel',
      space: ' ',
      operation: 'Operation',
      requestTimeout: 'Request Timeout',
      error: 'Error',
      success: 'Success'
    },
    user: {
      user: 'User',
      account: 'Account',
      name: 'Name',
      password: 'Password',
      checkPass: 'CheckPass'
    },
    role: {
      role: 'Role',
      name: 'Name'
    },
    resource: {
      resource: 'Resource',
      id: 'ID',
      name: 'Name'
    }
  },
  zh: {
    http: {
      'GET_WRONG_PARAM': '参数错误'
    },
    message: {
      greet: '祝君好运'
    },
    validation: {
      require: '请输入',
      characters: '字符',
      checkPass: '请再次输入密码',
      passDiff: '两次输入密码不一致'
    },
    common: {
      add: '添加',
      edit: '编辑',
      delete: '删除',
      confirm: '确定',
      cancel: '取消',
      space: '',
      operation: '操作',
      requestTimeout: '请求超时',
      error: '错误',
      success: '成功'
    },
    user: {
      user: '用户',
      account: '账户',
      name: '用户名',
      password: '密码',
      checkPass: '确认密码'
    },
    role: {
      role: '角色',
      name: '名称'
    },
    resource: {
      resource: '资源',
      id: 'ID',
      name: '名称'
    }
  }
}

const i18n = new VueI18n({
  locale: 'zh',
  messages
})

export default i18n
