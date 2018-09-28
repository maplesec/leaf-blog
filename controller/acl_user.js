'use strict';

import BaseComponent from '../prototype/baseComponent'
import UserOptions from '../models/acl_user'
import ResourceModel from '../models/acl_resource'
import formidable from 'formidable'
import ResourceController from './acl_resource'

const cols = 'id name account'

function allowedPermissions(user_id, resources){
    return new Promise(function(resolve,reject){
        global.acl.allowedPermissions(user_id.toString(), resources, function(err, obj){
            if(err){
                console.error('allowedPermissions', JSON.stringify(err));
                reject({message: 'allowedPermissions failed'})
            }else{
                resolve(obj);
            }
        })
    })
}

function userRoles(user_id){
    return new Promise(function(resolve, reject){
        global.acl.userRoles(user_id.toString(), function(err, roles){
            if(err){
                console.error('userRoles', JSON.stringify(err));
                reject({message: 'userRoles failed'})
            }else{
                resolve(roles);
            }
        })
    })
}

function addUserRoles(user_id, roles_to_add){
    return new Promise(function(resolve,reject){
        if(!roles_to_add.length){
            resolve();
        }
        global.acl.addUserRoles(user_id.toString(), roles_to_add, function(err){
            if(err){
                console.log('addUserRoles failed:' + err)
                reject({message: 'addUserRoles failed:' + err})
            }else{
                resolve();
            }
        })
    })
}

function removeUserRoles (user_id, roles) {
    return new Promise(function (resolve,reject) {
        if(roles.length){
            global.acl.removeUserRoles(user_id.toString(), roles, function (err) {
                if(err){
                    console.error('removeUserRoles', JSON.stringify(err));
                    reject({message: 'removeUserRoles failed'})
                }else{
                    resolve();
                }
            })
        }else{
            resolve();
        }
    })
}

class User extends BaseComponent{
    constructor(options){
        super(options)
    }

    /**
     * 登录
     * @param {*} account 
     * @param {*} password 
     */
    async login(account, password) {
        try {
            if (!account) {
                throw new Error('account is required');
            } else if (!password) {
                throw new Error('password is required');
            }
        }catch (err) {
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try {
            const user_obj = await this.basemodel.findOne({account, password});
            if (user_obj) {
                // 登陆成功
                const {name, account} = user_obj;
                const id = user_obj.id.toString();
                const ResourceResponse = await ResourceController.list();
                const resourceList = ResourceResponse.response.result;
                let resources = [];
                resourceList.forEach(function(item){
                    resources.push(item.id);
                });
                const permissions = await allowedPermissions(id, resources);
                const roles = await userRoles(id);
                const mix = { id, name, account, permissions, roles };
                return({
                    status: 1,
                    type: 'SUCCESS',
                    response: mix
                });
            }else{
                const hasAccount = await this.basemodel.findOne({account});
                if (hasAccount) {
                    return({
                        status: 0,
                        type: '',
                        message: '密码错误'
                    })
                } else {
                    return({
                        status: 0,
                        type: '',
                        message: '账号不存在'
                    })
                }
            }
        }catch (err) {
            console.log('login', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 当前用户信息
     * @param {*} user_id 
     */
    async getProfile(user_id) {
        if(!user_id || !Number(user_id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid user_id'
            })
        }
        try{
            const ResourceResponse = await ResourceController.list();
            const resourceList = ResourceResponse.response.result;
            let resources = [];
            resourceList.forEach(function(item){
                resources.push(item.id);
            });
            const permissions = await allowedPermissions(user_id, resources);
            const roles = await userRoles(user_id);
            const user_obj = await this.basemodel.findOne({id: user_id}, cols);
            const {id, name, account} = user_obj;
            const mix = { id, name, account, permissions, roles };
            return({
                status: 1,
                type: 'SUCCESS',
                response: mix
            });
        }catch(err){
            console.log('getProfile', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 增加用户, 并指定角色
     * @param {*} account 
     * @param {*} name 
     * @param {*} password 
     * @param {*} roles 
     */
    async create(account, name, password, roles){
        try {
            if (!account) {
                throw new Error('account is required');
            } else if (!name) {
                throw new Error('name is required');
            } else if (!password) {
                throw new Error('password is required');
            }
        }catch (err) {
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try {
            const id = await this.getId(this.model + '_id');
            const newItem = {
                id: id,
                account,
                name,
                password
            }
            await this.basemodel.create(newItem);
            if (roles) {
                // 指定用户角色
                await addUserRoles(id, roles);
            }
            return({
                status: 1,
                type: 'SUCCESS',
                response: {
                    id
                }
            })
        }catch (err) {
            console.log('add', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 删除用户,并移除角色对应关系
     * @param {*} id 
     */
    async remove (id) {
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id',
            }) 
        }
        try{
            await this.basemodel.findOneAndRemove({id});
            const roles = await userRoles(id);
            await removeUserRoles(id, roles);
            return({
                status: 1,
                type: 'SUCCESS'
            })
        }catch (err) {
            console.log(this.model + ' delete', err.message);
            return({
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 获取单个用户, 及对应角色和资源的权限
     * @param {*} id 
     */
    async get(id) {
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id'
            })
        }
        try{
            const ResourceResponse = await ResourceController.list();
            const resourceList = ResourceResponse.response.result;
            let resources = [];
            resourceList.forEach(function(item){
                resources.push(item.id);
            });
            const permissions = await allowedPermissions(id, resources);
            const roles = await userRoles(id);
            const user_obj = await this.basemodel.findOne({id: id}, cols);
            const {id, name, account} = user_obj;
            const mix = { id, name, account, permissions, roles };
            return({
                status: 1,
                type: 'SUCCESS',
                response: mix
            });
        }catch(err){
            console.log(this.model + ' get', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 更新用户
     * @param {*} id 
     * @param {*} name 
     * @param {*} password 
     * @param {*} roles 
     */
    async update(id, name, password, roles){
        try{
            if(!id || !Number(id)){
                throw new Error('invalid user_id')
            }
        }catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            let item = {};
            if (name) {
                item['name'] = name;
            }
            if (password) {
                item['password'] = password;
            }
            await this.basemodel.update({id}, item)
            if (roles) {
                const _now = await userRoles(id);
                await removeUserRoles(id, _now);
                await addUserRoles(id, roles);
            }
            return({
                status: 1,
                type: 'SUCCESS'
            })
        }catch(err){
            console.log(this.model + ' update', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 检查重名
     * @param {*} name 
     */
    async isUserNameAvailable (name) {
        try {
            const user = await this.basemodel.find({name: name});
            return({
                status: 1,
                type: 'SUCCESS',
                response: {
                    available: user.length === 0
                }
            })
        } catch (err) {
            console.log('isUserNameAvailable', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 当前用户改密
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async updateSelfPassword(req, res, next) {
        const user_id = req.session.user_id;
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            const {oldPassword, newPassword} = fields;
            try {
                if(!user_id || !Number(user_id)){
                    throw new Error('invalid user_id')
                }
                if(!oldPassword || !newPassword){
                    throw new Error('invalid password')
                }
            } catch (err) {
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }
            try {
                const user = await this.basemodel.find({id: user_id, password: oldPassword})
                if (user.length > 0){
                    const newUser = {
                        password: newPassword
                    }
                    await this.basemodel.update({id: user_id}, newUser)
                    res.send({
                        status: 1,
                        type: 'SUCCESS',
                    })
                }else{
                    res.send({
                        status: 0,
                        type: 'WRONG_PASSWORD',
                        message: 'incorrect password'
                    })
                }
            } catch (err) {
                console.log('updateSelfPassword', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_DB',
                    message: err.message
                })
            }
        })
    }
}
export default new User(UserOptions)