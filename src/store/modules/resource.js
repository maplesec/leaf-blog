import * as api from '@/services/resource'
import $doRequest from '@/utils/formatFetch'
import template from '../template'

const resource = {
    namespaced: true,
    state: {
        ...template.state,
        module: 'resource',
    },
    getters: {},
    mutations: {
        ...template.mutations,
    },
    actions: {
        ...template.actions(api.getResourceList),
        getDetail({commit}, id){
            return $doRequest(api.getResource(id))
        },
        create({commit}, params){
            return $doRequest(api.addResource(params))
        },
        update({commit}, {id, params}){
            return $doRequest(api.editResource(id, params))
        },
        delete({commit}, id){
            return $doRequest(api.deleteResource(id))
        }
    }
}

export default resource
