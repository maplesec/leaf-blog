import * as api from '@/services/draft'
import $doRequest from '@/utils/formatFetch'
import template from '../template'

const draft = {
    namespaced: true,
    state: {
        ...template.state,
        module: 'draft',
    },
    getters: {},
    mutations: {
        ...template.mutations,
    },
    actions: {
        ...template.actions(api.getDraftList),
        getDetail({commit}, id){
            return $doRequest(api.getDraft(id))
        },
        create({commit}, params){
            return $doRequest(api.addDraft(params))
        },
        update({commit}, {id, params}){
            return $doRequest(api.editDraft(id, params))
        },
        delete({commit}, id){
            return $doRequest(api.deleteDraft(id))
        }
    }
}

export default draft
