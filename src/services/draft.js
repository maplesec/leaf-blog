import axios from '@/services/axios'

// 获取文章列表
export const getDraftList = (query) => axios.get(`/draft?page=${query.page}&pageSize=${query.pageSize}&filter=${query.filter}&sortBy=${query.sortBy}&sort=${query.sort}`)

// 添加文章
export const addDraft = (params) => axios.post('./draft', params)

// 删除文章
export const deleteDraft = (id) => axios.delete('./draft/' + id)

// 编辑文章
export const editDraft = (id, params) => axios.put('./draft/' + id, params)

// 获取单个文章
export const getDraft = (id) => axios.get('/draft/' + id)

// 获取html文章
export const getArticle = (id) => axios.get(`/draft/${id}?html=true`)