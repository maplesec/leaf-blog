'use strict';

import express from 'express'
import Draft from '../controller/draft'
import formidable from 'formidable'

const router = express.Router();

async function getDraft(req,res,next){
    const {page, pageSize, filter = '', sort = 'desc', sortBy = ''} = req.query;
    res.send(await Draft.getDraft(page, pageSize, filter, sort, sortBy));
}

async function getDraftById(req, res, next){
    const draft_id = req.params.draft_id;
    const html = req.query.html;
    res.send(await Draft.getDraftById(draft_id, html));
}

async function createDraft(req, res, next){
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {title, imagesrc, content} = fields;
        res.send(await Draft.createDraft(title, imagesrc, content));
    })
}

async function updateDraft (req, res, next) {
    const draft_id = req.params.draft_id;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {title, imagesrc, content} = fields;
        res.send(await Draft.updateDraft(draft_id, title, imagesrc, content));
    })
}

async function deleteDraft(req, res, next){
    const {draft_id} = req.params;
    res.send(await Draft.deleteDraft(draft_id));
}


router.get('/', getDraft);
router.post('/', createDraft);
router.get('/:draft_id', getDraftById);
router.delete('/:draft_id', deleteDraft);
router.put('/:draft_id', updateDraft);

export default router
