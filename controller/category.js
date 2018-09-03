'use strict';

import BaseComponent from '../prototype/baseComponent'
import BaseModel from '../models/category'

const cols = 'id name style'
const model = 'category'

class Category extends BaseComponent{
    constructor(){
        super()
    }

    /**
     * 分页获取
     * @param {*} page 
     * @param {*} pageSize 
     * @param {*} filter 
     * @param {*} sort 
     * @param {*} sortBy 
     */
    async list(page, pageSize, filter, sort, sortBy) {
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
                action = BaseModel.find({$or: [{name: eval('/' + filter + '/gi')}]}, cols);
                actionCount = BaseModel.find({$or: [{name: eval('/' + filter + '/gi')}]}, cols).count();
            } else {
                action = BaseModel.find({}, cols);
                actionCount = BaseModel.find({}, cols).count();
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
            console.log(model + ' get', err.message)
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 增加
     * @param {*} name 
     * @param {*} style 
     */
    async create(name, style){
        try{
            if(!name){
                throw new Error('name is required');
            }
            if(!style){
                throw new Error('style is required')
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
            const id = await this.getId(model + '_id');
            const newItem = {
                id,
                name
            }
            await BaseModel.create(newItem);
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
    async remove(id){
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id',
            }) 
        }
        try{
            await RoleModel.findOneAndRemove({id});
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }
        catch (err){
            console.log(model + ' delete', err.message);
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
            const item = await BaseModel.findOne({id: id}, cols);
            return({
                status: 1,
                type: 'SUCCESS',
                response: item
            });
        }catch(err){
            console.log(model + ' get', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 更新
     * @param {*} id 
     * @param {*} name 
     * @param {*} style 
     */
    async update(id, name, style){
        try{
            if(!id){
                throw new Error('invalid resource_id')
            }
            if(!name){
                throw new Error('invalid name');
            }
            if(!style){
                throw new Error('invalid style')
            }
        }catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            const item = {
                name,
                style
            }
            await BaseModel.update({id}, item);
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }catch(err){
            console.log(model + ' update', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    
}

export default new Category()