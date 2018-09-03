'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema =  new Schema({
    id: Number,
    name: String,
    account: String,
    password: String
})

userSchema.index({id: 1});

const User = mongoose.model('User', userSchema);

export default User