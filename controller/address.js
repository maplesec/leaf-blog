'use strict';

import BaseComponent from '../prototype/baseComponent'
import AddressModel from '../models/address'
import formidable from 'formidable'

class Address extends BaseComponent{
    constructor(){
        super()
        this.addAddress = this.addAddress.bind(this);
    }

    async getAddress(req,res,next){
        const addressList = await AddressModel.find();
        res.send(addressList);
    }
    async addAddress(req, res, next){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {address, name} = fields;
            try{
                if(!address){
                    throw new Error('地址信息错误');
                }else if(!name){
                    throw new Error('用户姓名错误');
                }
            }catch(err){
                console.log(err.message);
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: err.message
                })
                return
            }
            try{
                const address_id = await this.getId('address_id');
                const newAddress = {
                    id: address_id,
                    address,
                    name
                }
                await AddressModel.create(newAddress);
                res.send({
                    status: 1,
                    success: '添加地址成功'
                })
            }catch(err){
                console.log('添加地址失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_ADD_ADDRESS',
                    message: '添加地址失败'
                })
            }
        })
    }
    async deleteAddress(req, res, next){
        const {address_id} = req.params;
        if(!address_id || !Number(address_id)){
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误',
            })
            return;
        }
        try{
            await AddressModel.findOneAndRemove({id: address_id});
            res.send({
                status: 1,
                success: '删除地址成功'
            })
        }catch (err){
            console.log('删除地址失败', err);
            res.send({
                type: 'ERROR_DELETE_ADDRESS',
                message: '删除地址失败'
            })
        }
    }
    async getAddAddressById(req, res, next){
        const address_id = req.params.address_id;
        if(!address_id || !Number(address_id)){
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误'
            })
            return
        }
        try{
            const address = await AddressModel.findOne({id: address_id});
            res.send(address);
        }catch(err){
            console.log('获取地址信息失败', err);
            res.send({
                type: 'ERROR_GET_ADDRESS',
                message: '获取地址信息失败'
            })
        }
    }
    async updateAddress(req, res, next){
        const address_id = req.params.address_id;
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            const {address, name} = fields;
            try{
                if(!address_id || !Number(address_id)){
                    throw new Error('参数错误')
                }
                if(!address){
                    throw new Error('地址信息错误');
                }else if(!name){
                    throw new Error('用户姓名错误');
                }
            }catch(err){
                console.log(err.message);
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: err.message
                })
                return
            }
            try{
                const newAddress = {
                    id: address_id,
                    address,
                    name
                }
                await AddressModel.update({id: address_id}, newAddress)
                res.send({
                    status: 1,
                    success: '编辑地址成功'
                })
            }catch(err){
                console.log('编辑地址失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_ADDRESS',
                    message: '编辑地址失败'
                })
            }
        })
    }

}
export default new Address()