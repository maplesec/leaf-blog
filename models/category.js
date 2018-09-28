'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const categorySchema =  new Schema({
    id: String,
    name: String,
    style: String,
})

categorySchema.index({id: 1});

const Category = mongoose.model('Category', categorySchema);

const Options = {
    cols_config: [
        {key: 'name', index: 0, required: true},
        {key: 'style', index: 1, required: true}
    ],
    cols: 'id name style',
    model: 'category',
    basemodel: Category,
}

export default Options