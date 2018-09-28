'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const resourceSchema =  new Schema({
    id: String,
    name: String
})

resourceSchema.index({id: 1});

const Resource = mongoose.model('Resource', resourceSchema);

const Options = {
    cols_config: [
        {key: 'id', index: 0, required: true},
        {key: 'name', index: 1, required: true}
    ],
    cols: 'id name',
    model: 'acl_resource',
    basemodel: Resource,
}

export default Options