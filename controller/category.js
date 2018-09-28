'use strict';

import BaseComponent from '../prototype/baseComponent'
import CategoryOptions from '../models/category'

class Category extends BaseComponent{
    constructor(options){
        super(options)
    }
}

export default new Category(CategoryOptions)