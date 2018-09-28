'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const roleSchema =  new Schema({
    id: Number,
    name: String
})

roleSchema.index({id: 1});

const Role = mongoose.model('Role', roleSchema);

const Options = {
    cols_config: [
        {key: 'name', index: 1, required: true}
    ],
    cols: 'id name',
    model: 'role',
    basemodel: Role,
}

export default Options