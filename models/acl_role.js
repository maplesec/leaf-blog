'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const roleSchema =  new Schema({
    id: Number,
    name: String
})

roleSchema.index({id: 1});

const Role = mongoose.model('Role', roleSchema);

export default Role