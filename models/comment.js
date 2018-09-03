'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const commentSchema =  new Schema({
    id: String,
    content: String,
    createTime: {
        type: Date
    },
    user: String,
    userAvator: {
        type: String,
        default: ''
    },
    replyTo: Number
})

commentSchema.index({id: 1});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment