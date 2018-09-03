'use strict';

import express from 'express'
import Address from '../controller/address'
const router = express.Router();

router.get('/', Address.getAddress);
router.post('/', Address.addAddress);
router.get('/:address_id', Address.getAddAddressById);
router.delete('/:address_id', Address.deleteAddress);
router.put('/:address_id', Address.updateAddress);

export default router