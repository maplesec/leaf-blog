'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const resourceSchema =  new Schema({
    id: String,
    name: String
})

resourceSchema.index({id: 1});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource