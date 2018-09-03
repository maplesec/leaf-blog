'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const tagSchema =  new Schema({
    name: String
})

tagSchema.index({id: 1});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag