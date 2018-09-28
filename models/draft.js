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
        {key: 'title', index: 0, required: false},
        {key: 'imagesrc', index: 1, required: false},
        {key: 'content', index: 2, required: false},
        {key: 'createTime', index: 3, required: false},
        {key: 'lastEditTime', index: 4, required: false},
        {key: 'excerpt', index: 5, required: false},
        {key: 'publish', index: 6, required: false}
    ],
    cols: 'id title imagesrc content createTime lastEditTime excerpt publish',
    model: 'draft',
    basemodel: Draft,
}

export default Options