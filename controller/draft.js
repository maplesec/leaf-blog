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
     * @param {*} id 
     * @param {*} html 为true时，返回html格式 
     */
    async get(id, html){
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id'
            })
        }
        try{
            let response = await this.basemodel.findOne({id}, this.cols);
            if(html && response){
                response = { ...response, content: marked(response.content) }
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