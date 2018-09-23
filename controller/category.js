'use strict';

import BaseComponent from '../prototype/baseComponent'
import BaseModel from '../models/category'

class Category extends BaseComponent{
    constructor(){
        super()
        // 设置创建和编辑的字段信息
        this.cols_config = [
            {key: 'name', index: 0, required: true},
            {key: 'style', index: 1, required: true}
        ];
        // 设置需要被查询的列
        this.cols = 'id name style'
        // 设置当前的模块名
        this.model = 'category'
        this.basemodel = BaseModel;
    }
}

export default new Category()