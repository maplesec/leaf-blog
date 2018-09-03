'use strict';

import express from 'express'
import authorize from './filter';
import controller from '../controller/category'
import formidable from 'formidable'

const router = express.Router();

async function list(req, res){
    const {page, pageSize, filter = '', sort = 'desc', sortBy = ''} = req.query;
    res.send(await controller.list(page, pageSize, filter, sort, sortBy));
}

async function create(req, res){
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {id, name, style} = fields;
        res.send(await controller.create(id, name, style))
    })
}

async function remove(req, res){
    const {id} = req.params;
    res.send(await controller.remove(id));
}

async function get(req, res){
    const {id} = req.params;
    res.send(await controller.get(id));
}

async function update(req, res){
    const {id} = req.params;
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
        const {name, style} = fields;
        res.send(await Resource.updateResource(id, name, style));
    })
}

router.get('/', [authorize('resource', 'show')], list);
router.post('/', [authorize('resource', 'operate')], create);
router.get('/:id', [authorize('resource', 'show')], get);
router.delete('/:id', [authorize('resource', 'operate')], remove);
router.put('/:id', [authorize('resource', 'operate')], update);

export default router