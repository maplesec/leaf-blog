'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const postSchema =  new Schema({
    title: String,
    visit: {
        type: Number,
        default: 0
    },
    imagesrc: String,
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    lastEditTime: {
        type: Date,
        default: Date.now
    },
    hidden: Boolean,
    excerpt: String,
    content: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

postSchema.index({id: 1});

const Post = mongoose.model('Post', postSchema);

export default Post