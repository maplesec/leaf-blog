'use strict';

import express from 'express'
import authorize from './filter';
import User from '../controller/acl_user'
import formidable from 'formidable'

const router = express.Router();

async function list(req, res, next) {
    const {page, pageSize, filter, sort, sortBy} = req.query;
    res.send(await User.list(page, pageSize, filter, sort,sortBy));
}

async function create(req, res, next){
    const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {account, name, password, roles} = fields;
            res.send(await User.create(account, name, password, roles));
        })
}

async function remove(req, res, next) {
    const {user_id} = req.params;
    res.send(await User.remove(user_id));
}

async function login(req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const {account, password} = fields;
        const response = await User.login(account, password);
        req.session.user_id = response.status === 1 ? response.response.id : null;
        res.send(response);
    })
}

async function logout(req, res, next) {
    req.session.user_id = null
    req.session.destroy();
    res.send({
        status: 1
    })
}

async function getProfile(req, res, next) {
    const user_id = req.session.user_id;
    res.send(await User.getProfile(user_id));
}

async function get(req, res, next){
    const user_id = req.params.user_id;
    res.send(await User.get(user_id));
}

async function update(req, res, next){
    const user_id = req.params.user_id;
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
        const {name, password, roles} = fields;
        res.send(await User.update(user_id, name, password, roles));
    })
}

async function isUserNameAvailable (req, res, next) {
    const name = req.params.name;
    res.send(await User.isUserNameAvailable(name));
}


router.get('/', [authorize('user', 'show')], list);
router.post('/', [authorize('user', 'operate')], create);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.get('/:user_id', [authorize('user', 'show')], get);
router.delete('/:user_id', [authorize('user', 'operate')], remove);
router.put('/:user_id', [authorize('user', 'operate')], update);
router.search('/:name', isUserNameAvailable);

export default router