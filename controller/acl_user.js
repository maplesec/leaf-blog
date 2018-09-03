'use strict';

import BaseComponent from '../prototype/baseComponent'
import UserModel from '../models/acl_user'
import ResourceModel from '../models/acl_resource'
import formidable from 'formidable'

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
    constructor(){
        super()
        this.addUser = this.addUser.bind(this);
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
            const user_obj = await UserModel.findOne({account, password});
            if (user_obj) {
                // 登陆成功
                const {name, account} = user_obj;
                const id = user_obj.id.toString();
                const resourceList = await ResourceModel.find();
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
                const hasAccount = await UserModel.findOne({account});
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
            const resourceList = await ResourceModel.find();
            let resources = [];
            resourceList.forEach(function(item){
                resources.push(item.id);
            });
            const permissions = await allowedPermissions(user_id, resources);
            const roles = await userRoles(user_id);
            const user_obj = await UserModel.findOne({id: user_id}, cols);
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
     * 分页获取用户列表
     * 如果page和pageSize信息不全,默认返回所有
     * @param {*} page 
     * @param {*} pageSize 
     * @param {*} filter 
     * @param {*} sort 
     * @param {*} sortBy 
     */
    async getUsers(page, pageSize, filter = '', sort = 'desc', sortBy = '') {
        let sortObj = {'id': -1}
        try {
            if (page && pageSize) {
                if (typeof(Number(page)) !== 'number' || !(/^[1-9]\d*$/.test(page))) {
                    throw new Error('page must be number')
                } else if (!Number(pageSize)) {
                    throw new Error('pageSize must be number')
                }
            }
            if (sortBy) {
                sortObj = {};
                sortObj[sortBy] = sort === 'asc' ? 1 : -1;
            }
        } catch (err) {
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try {
            const offset = (page - 1) * pageSize;
            let action;
            let actionCount;
            if (filter) {
                // 多字段模糊查询
                action = UserModel.find({$or: [{name: eval('/' + filter + '/gi')}, {account: eval('/' + filter + '/gi')}]}, cols);
                actionCount = UserModel.find({$or: [{name: eval('/' + filter + '/gi')}, {account: eval('/' + filter + '/gi')}]}, cols).count();
            } else {
                action = UserModel.find({}, cols);
                actionCount = UserModel.find({}, cols).count();
            }
            if (page && pageSize){
                // 分页与排序
                action = action.limit(Number(pageSize)).skip(Number(offset)).sort(sortObj);
            } else {
                action = action.sort(sortObj);
            }
            const totalCount = await actionCount;
            const result = await action;
            return({
                status: 1,
                type: 'SUCCESS',
                response: {
                    totalCount,
                    result
                }
            })
        } catch (err) {
            console.log('getUsers', err.message)
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
    async addUser(account, name, password, roles){
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
            const user_id = await this.getId('user_id');
            const newUser = {
                id: user_id,
                account,
                name,
                password
            }
            const user = await UserModel.create(newUser);
            if (roles) {
                // 指定用户角色
                await addUserRoles(user_id, roles);
            }
            return({
                status: 1,
                type: 'SUCCESS',
                response: {
                    id: user_id
                }
            })
        }catch (err) {
            console.log('addUser', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 删除用户,并移除角色对应关系
     * @param {*} user_id 
     */
    async deleteUser (user_id) {
        if (!user_id || !Number(user_id)) {
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid user_id',
            })
        }
        try{
            await UserModel.findOneAndRemove({id: user_id});
            const roles = await userRoles(user_id);
            await removeUserRoles(user_id, roles);
            return({
                status: 1,
                type: 'SUCCESS'
            })
        }catch (err) {
            console.log('deleteUser', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 获取单个用户, 及对应角色和资源的权限
     * @param {*} user_id 
     */
    async getUserById(user_id) {
        if(!user_id || !Number(user_id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid user_id'
            })
        }
        try{
            const resourceList = await ResourceModel.find();
            let resources = [];
            resourceList.forEach(function(item){
                resources.push(item.id);
            });
            const permissions = await allowedPermissions(user_id, resources);
            const roles = await userRoles(user_id);
            const user_obj = await UserModel.findOne({id: user_id}, cols);
            const {id, name, account} = user_obj;
            const mix = { id, name, account, permissions, roles };
            return({
                status: 1,
                type: 'SUCCESS',
                response: mix
            });
        }catch(err){
            console.log('getUserById', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 更新用户
     * @param {*} user_id 
     * @param {*} name 
     * @param {*} password 
     * @param {*} roles 
     */
    async updateUser(user_id, name, password, roles){
        try{
            if(!user_id || !Number(user_id)){
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
            let newUser = {};
            if (name) {
                newUser['name'] = name;
            }
            if (password) {
                newUser['password'] = password;
            }
            await UserModel.update({id: user_id}, newUser)
            if (roles) {
                const _now = await userRoles(user_id);
                await removeUserRoles(user_id, _now);
                await addUserRoles(user_id, roles);
            }
            return({
                status: 1,
                type: 'SUCCESS'
            })
        }catch(err){
            console.log('updateUser', err.message);
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
            const user = await UserModel.find({name: name});
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
                const user = await UserModel.find({id: user_id, password: oldPassword})
                if (user.length > 0){
                    const newUser = {
                        password: newPassword
                    }
                    await UserModel.update({id: user_id}, newUser)
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
export default new User()