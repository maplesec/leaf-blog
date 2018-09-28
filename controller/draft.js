'use strict';

import BaseComponent from '../prototype/baseComponent'
import DraftOptions from '../models/draft'
import marked from 'marked';

class Draft extends BaseComponent {
    constructor(options) {
        super(options)
    }

    /**
     * 获取单个文章
     * @param {*} draft_id 
     * @param {*} html 为true时，返回html格式 
     */
    async get(draft_id, html){
        if(!draft_id || !Number(draft_id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid draft_id'
            })
        }
        try{
            const draft = await this.basemodel.findOne({id: draft_id});
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
}

export default new Draft(DraftOptions)