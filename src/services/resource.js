import axios from '@/services/axios'

// 获取资源列表
export const getResourceList = (query) => axios.get(`/acl_resource?page=${query.page}&pageSize=${query.pageSize}&filter=${query.filter}&sortBy=${query.sortBy}&sort=${query.sort}`)

// 获取所有资源
export const getResourceAll = () => axios.get(`/acl_resource`)

// 添加资源
export const addResource = (params) => axios.post('./acl_resource', params)

// 删除资源
export const deleteResource = (id) => axios.delete('./acl_resource/' + id)

// 编辑资源
export const editResource = (id, params) => axios.put('./acl_resource/' + id, params)

// 获取单个资源
export const getResource = (id) => axios.get('/acl_resource/' + id)
