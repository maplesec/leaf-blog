'use strict';

import express from 'express'
import authorize from './filter';
import Resource from '../controller/acl_resource'
import formidable from 'formidable'

const router = express.Router();

async function list(req, res, next){
    const {page, pageSize, filter = '', sort = 'desc', sortBy = ''} = req.query;
    res.send(await Resource.list(page, pageSize, filter, sort, sortBy));
}

async function create(req, res, next){
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {id, name} = fields;
        res.send(await Resource.create(id, name));
    });
}

async function remove(req, res, next){
    const {id} = req.params;
    res.send(await Resource.remove(id));
}

async function get(req, res, next){
    const {id} = req.params;
    res.send(await Resource.get(id));
}

async function update(req, res, next){
    const {id} = req.params;
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
        const {name} = fields;
        res.send(await Resource.update(id, name));
    })
}

router.get('/', [authorize('resource', 'show')], list);
router.post('/', [authorize('resource', 'operate')], create);
router.get('/:id', [authorize('resource', 'show')], get);
router.delete('/:id', [authorize('resource', 'operate')], remove);
router.put('/:id', [authorize('resource', 'operate')], update);

export default router
