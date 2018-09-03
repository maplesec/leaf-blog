import axios from '@/services/axios'

// 获取角色列表
export const getRoleList = (query) => axios.get(`/acl_role?page=${query.page}&pageSize=${query.pageSize}&filter=${query.filter}&sortBy=${query.sortBy}&sort=${query.sort}`)

// 获取所有角色
export const getRoleAll = () => axios.get(`/acl_role`)

// 添加角色
export const addRole = (params) => axios.post('/acl_role', params)

// 删除角色
export const deleteRole = (id) => axios.delete('/acl_role/' + id)

// 编辑角色
export const editRole = (id, params) => axios.put('/acl_role/' + id, params)

// 获取单个角色
export const getRole = (id) => axios.get('/acl_role/' + id)

// 设置角色权限
export const setAllow = (id, params) => axios.post('/acl_role/' + id, params)
