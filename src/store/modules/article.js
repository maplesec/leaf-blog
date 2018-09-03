import * as api from '@/services/draft'
import $doRequest from '@/utils/formatFetch'
import template from '../template'

const article = {
    namespaced: true,
    state: {
        ...template.state,
        module: 'article',
        detail: {
            id: 0,
            title: '',
            createTime: '',
            lastEditTime: '',
            excerpt: '',
            content: ''
        }
    },
    getters: {},
    mutations: {
        ...template.mutations,
        SET_DETAIL: (state, formatResponse) => {
            state.detail = { ...formatResponse }
        }
    },
    actions: {
        ...template.actions(api.getDraftList),
        getArticle({commit}, id){
            return $doRequest(api.getArticle(id), (formatResponse) => {
                console.log('formatResponse', formatResponse)
                commit('SET_DETAIL',formatResponse);
            });
        }
    }
}

export default article