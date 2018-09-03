'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const categorySchema =  new Schema({
    id: String,
    name: String,
    style: String,
})

categorySchema.index({id: 1});

const Category = mongoose.model('Category', categorySchema);

export default Category