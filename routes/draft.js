'use strict';

import express from 'express'
import Draft from '../controller/draft'
import formidable from 'formidable'

const router = express.Router();

async function list(req,res,next){
    const {page, pageSize, filter = '', sort = 'desc', sortBy = ''} = req.query;
    res.send(await Draft.list(page, pageSize, filter, sort, sortBy));
}

async function get(req, res, next){
    const draft_id = req.params.draft_id;
    const html = req.query.html;
    res.send(await Draft.get(draft_id, html));
}

async function create(req, res, next){
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {title, imagesrc, content, category} = fields;
        res.send(await Draft.create(title, imagesrc, content, category));
    })
}

async function update (req, res, next) {
    const draft_id = req.params.draft_id;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {title, imagesrc, content, category} = fields;
        res.send(await Draft.update(draft_id, title, imagesrc, content, category));
    })
}

async function remove(req, res, next){
    const {draft_id} = req.params;
    res.send(await Draft.remove(draft_id));
}


router.get('/', list);
router.post('/', create);
router.get('/:draft_id', get);
router.delete('/:draft_id', remove);
router.put('/:draft_id', update);

export default router
