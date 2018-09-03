import $doRequest from '@/utils/formatFetch'

const template  = {
    state: {
        list: {
            loading: false,
            data: [],
            pagination: {
                totalCount: 0,
                page: 1,
                pageSize: 12,
                sortBy: '',
                sort: '',
                filter: ''
            }
        },
    },
    mutations: {
        SET_lIST: (state, formatResponse) => {
            state.list.data = formatResponse.result;
            state.list.loading = false;
            state.list.pagination.totalCount = formatResponse.totalCount;
        },
        LOADING_lIST: (state) => {
            state.list.loading = true;
        },
        SET_PAGINATION: (state, pagination) => {
            state.list.pagination = { ...state.list.pagination, ...pagination };
        }
    },
    actions (getList) {
        return {
            getList({ commit, state }){
                commit('LOADING_lIST');
                return $doRequest(getList(state.list.pagination), (formatResponse)=>{
                    commit('SET_lIST', formatResponse);
                })
            },
            setPagination({ commit }, pagination){
                commit('SET_PAGINATION', pagination);
            }
        }
    }
}

export default template