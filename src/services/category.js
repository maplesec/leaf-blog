import axios from '@/services/axios'
const module = 'category'

// 获取列表
export const list = (query) => axios.get(`/${module}?page=${query.page}&pageSize=${query.pageSize}&filter=${query.filter}&sortBy=${query.sortBy}&sort=${query.sort}`)

// 创建
export const create = (params) => axios.post(`./${module}`, params)

// 删除
export const remove = (id) => axios.delete(`./${module}/` + id)

// 编辑
export const update = (id, params) => axios.put(`./${module}/` + id, params)

// 获取单个
export const get = (id) => axios.get(`/${module}/` + id)