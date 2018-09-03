'use strict';

import BaseComponent from '../prototype/baseComponent'
import DraftModel from '../models/draft'
import formidable from 'formidable'
import marked from 'marked';

class Draft extends BaseComponent {
    constructor() {
        super()
        this.createDraft = this.createDraft.bind(this);
    }

    /**
     * 分页获取文章
     * @param {*} page 
     * @param {*} pageSize 
     * @param {*} filter 
     * @param {*} sort 
     * @param {*} sortBy 
     */
    async getDraft(page, pageSize, filter, sort, sortBy) {
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
                action = DraftModel.find({$or: [{title: eval('/' + filter + '/gi')}]});
                actionCount = DraftModel.find({$or: [{title: eval('/' + filter + '/gi')}]}).count();
            } else {
                action = DraftModel.find();
                actionCount = DraftModel.find().count();
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
            console.log('getDraft', err.message)
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 获取单个文章
     * @param {*} draft_id 
     * @param {*} html 为true时，返回html格式 
     */
    async getDraftById(draft_id, html){
        if(!draft_id || !Number(draft_id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid draft_id'
            })
        }
        try{
            const draft = await DraftModel.findOne({id: draft_id});
            const {id, title, imagesrc, content, createTime, lastEditTime, excerpt, publish} = draft;
            let response = { id, title, imagesrc, content, createTime, lastEditTime, excerpt, publish };
            if(html && draft){
                response = { ...response, content: marked(content) }
            }
            return({
                status: 1,
                type: 'SUCCESS',
                response: response
            });
        }catch(err){
            console.log('getDraftById', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }
    
    /**
     * 创建文章
     * @param {*} title 
     * @param {*} imagesrc 
     * @param {*} content 
     */
    async createDraft(title, imagesrc, content){
        const createTime = new Date();
        const lastEditTime = new Date();
        const excerpt = '';
        const publish = false;
        try{
            const draft_id = await this.getId('draft_id');
            console.log(draft_id);
            const newDraft = {
                id: draft_id,
                title,
                imagesrc,
                content,
                createTime,
                lastEditTime,
                excerpt,
                publish
            }
            await DraftModel.create(newDraft);
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }catch(err){
            console.log('addDraft', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 更新文章
     * @param {*} title 
     * @param {*} imagesrc 
     * @param {*} content 
     */
    async updateDraft (draft_id, title, imagesrc, content) {
        const createTime = new Date();
        const lastEditTime = new Date();
        const excerpt = '';
        const publish = false;
        try{
            if(!draft_id || !Number(draft_id)){
                throw new Error('draft_id is invalid')
            }
        }catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            const newDraft = {
                id: draft_id,
                title,
                imagesrc,
                content,
                createTime,
                lastEditTime,
                excerpt,
                publish
            }
            await DraftModel.update({id: draft_id}, newDraft)
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }catch(err){
            console.log('updateDraft', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 删除文章
     * @param {*} draft_id 
     */
    async deleteDraft(draft_id){
        if(!draft_id || !Number(draft_id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid draft_id',
            })
        }
        try{
            await DraftModel.findOneAndRemove({id: draft_id});
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }catch (err){
            console.log('deleteDraft', err);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }
}

export default new Draft()