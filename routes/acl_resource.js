'use strict';

import express from 'express'
import authorize from './filter';
import Resource from '../controller/acl_resource'
import formidable from 'formidable'

const router = express.Router();

async function getResource(req, res, next){
    const {page, pageSize, filter = '', sort = 'desc', sortBy = ''} = req.query;
    res.send(await Resource.getResource(page, pageSize, filter, sort, sortBy));
}

async function addResource(req, res, next){
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {id, name} = fields;
        res.send(await Resource.addResource(id, name));
    });
}

async function deleteResource(req, res, next){
    const {id} = req.params;
    res.send(await Resource.deleteResource(id));
}

async function getResourceById(req, res, next){
    const {id} = req.params;
    res.send(await Resource.getResourceById(id));
}

async function updateResource(req, res, next){
    const {id} = req.params;
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
        const {name} = fields;
        res.send(await Resource.updateResource(id, name));
    })
}

router.get('/', [authorize('resource', 'show')], getResource);
router.post('/', [authorize('resource', 'operate')], addResource);
router.get('/:id', [authorize('resource', 'show')], getResourceById);
router.delete('/:id', [authorize('resource', 'operate')], deleteResource);
router.put('/:id', [authorize('resource', 'operate')], updateResource);

export default router
