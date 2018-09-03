import * as api from '@/services/category'
import $doRequest from '@/utils/formatFetch'
import template from '../template'

const category = {
    namespaced: true,
    state: {
        ...template.state,
        module: 'category',
    },
    getters: {},
    mutations: {
        ...template.mutations,
    },
    actions: {
        ...template.actions(api.list),
        getDetail({commit}, id){
            return $doRequest(api.get(id))
        },
        create({commit}, params){
            return $doRequest(api.create(params))
        },
        update({commit}, {id, params}){
            return $doRequest(api.update(id, params))
        },
        delete({commit}, id){
            return $doRequest(api.remove(id))
        }
    }
}

export default category