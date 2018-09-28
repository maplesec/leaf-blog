import * as api from '@/services/role'
import $doRequest from '@/utils/formatFetch'
import template from '../template'

const state = JSON.parse(JSON.stringify(template.state))
const role = {
  namespaced: true,
  state: {
      ...state,
      module: 'role',
  },
  getters: {},
  mutations: {
      ...template.mutations,
  },
  actions: {
    ...template.actions(api.getRoleList),
    getDetail({commit}, id){
        return $doRequest(api.getRole(id))
    },
    create({commit}, params){
        return $doRequest(api.addRole(params))
    },
    update({commit}, {id, params}){
        return $doRequest(api.editRole(id, params))
    },
    delete({commit}, id){
        return $doRequest(api.deleteRole(id))
    },
    getListAll({commit}){
      return $doRequest(api.getRoleAll())
    }
  }
}

export default role
