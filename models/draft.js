'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const draftSchema =  new Schema({
    id: Number,
    title: String,
    imagesrc: String,
    // tags: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Tag'
    //     }
    // ],
    createTime: {
        type: Date
    },
    lastEditTime: {
        type: Date,
        default: Date.now
    },
    category: Number,
    excerpt: String,
    content: String,
    // post: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Post'
    // },
    published: Boolean
})

draftSchema.index({id: 1});

const Draft = mongoose.model('Draft', draftSchema);

const Options = {
    cols_config: [
        {key: 'title', index: 0, required: true},
        {key: 'imagesrc', index: 1, required: false},
        {key: 'content', index: 2, required: true},
        {key: 'category', index: 3, required: true, type: 'int'},
        {key: 'createTime', index: 4, required: false, default(){return new Date();}},
        {key: 'lastEditTime', index: 5, required: false, default(){return new Date();}},
        {key: 'excerpt', index: 6, required: false, default(){return '';}},
        {key: 'publish', index: 7, required: false, default(){return false;}}
    ],
    cols_config_edit: [
        {key: 'title', index: 0, required: false},
        {key: 'imagesrc', index: 1, required: false},
        {key: 'content', index: 2, required: false},
        {key: 'category', index: 3, required: false, type: 'int'},
        {key: 'lastEditTime', index: 5, required: false, default(){return new Date();}},
        {key: 'excerpt', index: 6, required: false},
        {key: 'publish', index: 7, required: false}
    ],
    cols: 'id title imagesrc content category createTime lastEditTime excerpt publish',
    model: 'draft',
    basemodel: Draft,
}

export default Options