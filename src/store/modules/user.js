import * as api from '@/services/user'
import $doRequest from '@/utils/formatFetch'
import template from '../template'

const state = JSON.parse(JSON.stringify(template.state))
const user = {
  namespaced: true,
  state: {
      ...state,
      module: 'user',
  },
  getters: {},
  mutations: {
      ...template.mutations,
  },
  actions: {
    ...template.actions(api.getUserList),
    getDetail({commit}, id){
      return $doRequest(api.getUser(id))
    },
    create({commit}, params){
      return $doRequest(api.addUser(params))
    },
    update({commit}, {id, params}){
      return $doRequest(api.editUser(id, params))
    },
    delete({commit}, id){
      return $doRequest(api.deleteUser(id))
    }
  }
}

export default user
