'use strict';

import express from 'express'
import authorize from './filter';
import Role from '../controller/acl_role'
import formidable from 'formidable'

const router = express.Router();

async function create(req, res, next){
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {name, allows} = fields;
        res.send(await Role.create(name, allows));
    });
}

async function list(req,res,next){
    const {page, pageSize, filter = '', sort = 'desc', sortBy = ''} = req.query;
    res.send(await Role.list(page, pageSize, filter, sort, sortBy));
}

async function remove(req, res, next){
    const {role_id} = req.params;
    res.send(await Role.remove(role_id));
}

async function get(req, res, next){
    const role_id = req.params.role_id;
    res.send(await Role.get(role_id));
}

async function update(req, res, next){
    const role_id = req.params.role_id;
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
        const {name, allows} = fields;
        res.send(await Role.update(role_id, name, allows))
    })
}

router.get('/', [authorize('role', 'show')], list);
router.post('/', [authorize('role', 'operate')], create);
router.get('/:role_id', [authorize('role', 'show')], get);
router.delete('/:role_id', [authorize('role', 'operate')], remove);
router.put('/:role_id', [authorize('role', 'show')], update);

export default router
