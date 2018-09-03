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
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category'
    // },
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

export default Draft