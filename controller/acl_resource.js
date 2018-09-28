'use strict';

import BaseComponent from '../prototype/baseComponent'
import ResourceOptions from '../models/acl_resource'

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
    constructor(options){
        super(options)
    }

    /**
     * 增加资源
     * 资源的键由用户指定,先校验重复,再增加
     * @param {*} id 
     * @param {*} name 
     */
    async create(...args){
        let params = {};
        try{
            this.cols_config.forEach((item) => {
                if(item.required && !args[item.index]){
                    throw new Error(item.key + ' is required')
                }
                params[item.key] = args[item.index];
            })
            console.log("params:", params)
        }
        catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            const existResource = await this.basemodel.find({id: id});
            // 定制：需要检查id是否被占用
            if (existResource.length > 0){
                return({
                    status: 0,
                    type: 'RESOURCE_EXISTED',
                    message: 'resource is existed'
                })
            } else {
                const newItem = {
                    id,
                    ...params
                }
                await this.basemodel.create(newItem);
                return({
                    status: 1,
                    success: 'SUCCESS',
                    response: {
                        id: id
                    }
                })
            }
        } catch(err) {
            console.log('add', err.message);
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
    async remove(id){
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id',
            }) 
        }
        try{
            await this.basemodel.findOneAndRemove({id});
            // 定制：需要acl同步删除资源
            await removeResource(id);
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }
        catch (err){
            console.log(this.model + ' delete', err.message);
            return({
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }
}
export default new Resource(ResourceOptions)