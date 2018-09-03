'use strict';

import BaseComponent from '../prototype/baseComponent'
import BaseModel from '../models/acl_resource'

function removeResource(id){
    return new Promise(function(resolve,reject){
        global.acl.removeResource(id, function(err){
            if(err){
                console.error('removeResource', JSON.stringify(err));
                reject({message: 'removeResource failed'})
            }else{
                resolve();
            }
        })
    })
}

class Resource extends BaseComponent{
    constructor(){
        super()
        this.addResource = this.addResource.bind(this);
    }

    /**
     * 分页获取资源列表
     * @param {*} page 
     * @param {*} pageSize 
     * @param {*} filter 
     * @param {*} sort 
     * @param {*} sortBy 
     */
    async getResource(page, pageSize, filter, sort, sortBy){
        let sortObj = {'id': -1}
        try {
            if (page && pageSize) {
                if (typeof(Number(page)) !== 'number' || !(/^[1-9]\d*$/.test(page))) {
                    throw new Error('page must be number')
                } else if (!Number(pageSize)) {
                    throw new Error('pageSize must be number')
                }
            }
            if (sortBy) {
                sortObj = {};
                sortObj[sortBy] = sort === 'asc' ? 1 : -1;
            }
        } catch (err) {
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try {
            const offset = (page - 1) * pageSize;
            let action;
            let actionCount;
            if (filter) {
                // 多字段模糊查询
                action = BaseModel.find({$or: [{id: eval('/' + filter + '/gi')}]});
                actionCount = BaseModel.find({$or: [{id: eval('/' + filter + '/gi')}]}).count();
            } else {
                action = BaseModel.find();
                actionCount = BaseModel.find().count();
            }
            if (page && pageSize){
                // 分页与排序
                action = action.limit(Number(pageSize)).skip(Number(offset)).sort(sortObj);
            } else {
                action = action.sort(sortObj);
            }
            const totalCount = await actionCount;
            const result = await action;
            return({
                status: 1,
                type: 'SUCCESS',
                response: {
                    totalCount,
                    result
                }
            })
        } catch (err) {
            console.log('getResource', err.message)
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 增加资源
     * 资源的键由用户指定,先校验重复,再增加
     * @param {*} id 
     * @param {*} name 
     */
    async addResource(id, name){
        try{
            if(!id){
                throw new Error('id is required');
            }else if(!name){
                throw new Error('name is required');
            }
        }catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            const existResource = await BaseModel.find({id: id});
            if (existResource.length > 0){
                return({
                    status: 0,
                    type: 'RESOURCE_EXISTED',
                    message: 'resource is existed'
                })
            } else {
                const newResource = {
                    id: id,
                    name
                }
                await BaseModel.create(newResource);
                return({
                    status: 1,
                    success: 'SUCCESS',
                    response: {
                        id
                    }
                })
            }
        } catch(err) {
            console.log('addResource', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 删除资源, 并删除对应关系
     * @param {*} id 
     */
    async deleteResource(id){
        if(!id){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid resource_id',
            })
        }
        try{
            await BaseModel.findOneAndRemove({id: id});
            await removeResource(id);
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }catch (err){
            console.log('deleteResource', err.message);
            return({
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    // TODO: 增加对应的角色信息
    /**
     * 获取单个资源信息
     * @param {*} id 
     */
    async getResourceById(id){
        if(!id){
            return({
                type: 'ERROR_PARAMS',
                message: '参数错误'
            })
        }
        try{
            const resource = await BaseModel.findOne({id: id});
            return({
                status: 1,
                type: 'SUCCESS',
                response: resource
            });
        }catch(err){
            console.log('获取地址信息失败', err);
            return({
                type: 'ERROR_GET_RESOURCE',
                message: '获取地址信息失败'
            })
        }
    }

    

    /**
     * 修改资源信息
     * @param {*} id 
     * @param {*} name 
     */
    async updateResource(id, name){
        try{
            if(!id){
                throw new Error('invalid resource_id')
            }
            if(!name){
                throw new Error('invalid name');
            }
        }catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            const newResource = {
                name
            }
            await BaseModel.update({id: id}, newResource)
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }catch(err){
            console.log('updateResource', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }
}
export default new Resource()