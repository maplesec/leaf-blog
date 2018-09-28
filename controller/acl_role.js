'use strict';

import BaseComponent from '../prototype/baseComponent'
import RoleOptions from '../models/category'
import ResourceController from './acl_resource'

const allow = function(roleObjs){
    return new Promise(function(resolve, reject){
        global.acl.allow(roleObjs, function(err){
            if(err){
                console.error('allow', JSON.stringify(err));
                reject({message: 'allow failed'})
            }else{
                resolve();
            }
        })
    })
}

function removeAllow(role_id, resources){
    return new Promise(function(resolve,reject){
        global.acl.removeAllow(role_id, resources, function(err){
            if(err){
                console.error('removeAllow', JSON.stringify(err));
                reject({message: 'removeAllow failed'})
            }else{
                resolve();
            }
        })
    })
}

function removeRole(role_id){
    return new Promise(function(resolve,reject){
        global.acl.removeRole(role_id, function(err){
            if(err){
                console.error('removeRole', JSON.stringify(err));
                reject({message: 'removeRole failed'})
            }else{
                resolve();
            }
        })
    })
}

function whatResources(role_id){
    return new Promise(function(resolve,reject){
        global.acl.whatResources(role_id, function(err, resources){
            if(err){
                console.error('whatResources', JSON.stringify(err));
                reject({message: 'whatResources failed'})
            }else{
                resolve(resources);
            }
        })
    })
}


class Role extends BaseComponent{
    constructor(options){
        super(options)
    }

    /**
     * 增加
     * @param {*} args 
     */
    async create(name, allows){
        try{
            if(!name){
                throw new Error('name is required');
            }
            if(allows){
                //校验是否符合规范
                if (typeof(allows) !== 'object') {
                    throw new Error('allows is not object')
                } else {
                    allows.forEach(function(allow){
                        if(!allow.resources){
                            throw new Error('resources is invalid')
                        }
                        if(!allow.permissions){
                            throw new Error('permissions is invalid')
                        }
                    })
                }
            }
        }
        catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }

        try{
            const id = await this.getId(this.model + '_id');
            const newItem = {
                id,
                name
            }
            await this.basemodel.create(newItem);
            if (allows) {
                await allow([{
                    roles: [id.toString()],
                    allows
                }])
            }
            return({
                status: 1,
                success: 'SUCCESS',
                response: {
                    id: id
                }
            })
        }catch(err){
            console.log('add', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 删除
     * @param {*} id 
     */
    async remove(id) {
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id',
            }) 
        }
        try{
            await this.basemodel.findOneAndRemove({id});
            const resourceList = await this.basemodel.find();
            let resources = [];
            resourceList.forEach(function(item){
                resources.push(item.id);
            });
            await removeAllow(id, resources);
            await removeRole(id);
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }catch (err){
            console.log(this.model + ' delete', err.message);
            return({
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    

    /**
     * 获取单个
     * @param {*} id 
     */
    async get(id){
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id'
            })
        }
        try{
            const item = await this.basemodel.findOne({id: id}, this.cols);
            const allows_raw =  await whatResources(id);
            // 转换格式,key值固定
            let allows = []
            for (let allow in allows_raw) {
                allows.push({
                    resources: allow,
                    permissions: allows_raw[allow],
                    key: allow
                })
            }
            const {id, name} = item;
            const mix = {id, name, allows};
            return({
                status: 1,
                type: 'SUCCESS',
                response: mix
            });
        }catch(err){
            console.log(this.model + ' get', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    

    /**
     * 更新角色
     * @param {*} role_id 
     * @param {*} name 
     * @param {*} allows 
     */
    async update(id, name, allows){
        try{
            if(!role_id || !Number(role_id)){
                throw new Error('role_id is invalid')
            }
            if(allows){
                //校验是否符合规范
                if (typeof(allows) !== 'object') {
                    throw new Error('allows is not object')
                } else {
                    allows.forEach(function(allow){
                        if(!allow.resources){
                            throw new Error('resources is invalid')
                        }
                        if(!allow.permissions){
                            throw new Error('permissions is invalid')
                        }
                    })
                }
            }
        }catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            let newRole = {}
            if (name) {
                newRole['name'] = name;
            }
            await this.basemodel.update({id: id}, newRole)
            if (allows) {
                const resource_response = await ResourceController.list();
                const old_resource_list = await resource_response.response.result;
                let old_resources = [];
                old_resource_list.forEach(function(item){
                    old_resources.push(item.id);
                })
                await removeAllow(id, old_resources);
                await allow([{
                    roles: [id],
                    allows
                }])
            }
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }catch(err){
            console.log(this.model + ' update', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }
}
export default new Role(RoleOptions)