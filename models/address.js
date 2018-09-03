'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const addressSchema =  new Schema({
    id: Number,
    address: String,
    name: String
})

addressSchema.index({id: 1});

const Address = mongoose.model('Address', addressSchema);

export default Address