'use strict';

import express from 'express'
import authorize from './filter';
import Role from '../controller/acl_role'
import formidable from 'formidable'

const router = express.Router();

async function addRole(req, res, next){
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {name, allows} = fields;
        res.send(await Role.addRole(name, allows));
    });
}

async function getRole(req,res,next){
    const {page, pageSize, filter = '', sort = 'desc', sortBy = ''} = req.query;
    res.send(await Role.getRole(page, pageSize, filter, sort, sortBy));
}

async function deleteRole(req, res, next){
    const {role_id} = req.params;
    res.send(await Role.deleteRole(role_id));
}

async function getRoleById(req, res, next){
    const role_id = req.params.role_id;
    res.send(await Role.getRoleById(role_id));
}

async function updateRole(req, res, next){
    const role_id = req.params.role_id;
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
        const {name, allows} = fields;
        res.send(await Role.updateRole(role_id, name, allows))
    })
}

router.get('/', [authorize('role', 'show')], getRole);
router.post('/', [authorize('role', 'operate')], addRole);
router.get('/:role_id', [authorize('role', 'show')], getRoleById);
router.delete('/:role_id', [authorize('role', 'operate')], deleteRole);
router.put('/:role_id', [authorize('role', 'show')], updateRole);

export default router
