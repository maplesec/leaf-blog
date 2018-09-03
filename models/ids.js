'use strict';

import mongoose from 'mongoose';

const idsSchema = new mongoose.Schema({
    address_id: Number,
    resource_id: Number,
    role_id: Number,
    user_id: Number,
    draft_id: Number,
    category_id: Number,
});

const Ids = mongoose.model('Ids', idsSchema);

Ids.findOne((err,data) => {
    if(!data){
        const newIds = new Ids({
            address_id: 0,
            resource_id: 0,
            role_id: 0,
            user_id: 0,
            draft_id: 0,
            category_id: 0,
        })
        newIds.save();
    }
})
export default Ids