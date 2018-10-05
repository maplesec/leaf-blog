import Ids from '../models/ids'

export default class BaseComponent{
    constructor(options={
        cols_config: [{key: 'key', index: 0, required: false}],
        cols: 'id key',
        model: 'model',
        basemodel: null,
    }){
        this.idList = ['address_id','user_id','role_id','resource_id','draft_id','category_id'];
        Object.assign(this, options);
    }
    async getId(type){
        if(!this.idList.includes(type)){
            console.log('id类型错误');
            throw new Error('id类型错误');
        }
        try{
            const idData = await Ids.findOne();
            if(typeof(idData[type]) !== 'number'){
                idData[type] = 0;
            }
            idData[type] ++;
            await idData.save();
            return idData[type]
        }catch(err){
            console.log('获取ID数据失败');
            throw new Error(err);
        }
    }

    /**
     * 分页获取
     * @param {*} page 
     * @param {*} pageSize 
     * @param {*} filter 
     * @param {*} sort 
     * @param {*} sortBy 
     */
    async list(page, pageSize, filter, sort, sortBy) {
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
                action = this.basemodel.find({$or: [{name: eval('/' + filter + '/gi')}]}, this.cols);
                actionCount = this.basemodel.find({$or: [{name: eval('/' + filter + '/gi')}]}, this.cols).count();
            } else {
                action = this.basemodel.find({}, this.cols);
                actionCount = this.basemodel.find({}, this.cols).count();
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
            console.log(this.model + ' get', err.message)
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 增加
     * @param {*} args 
     */
    async create(...args){
        let params = {};
        try{
            this.cols_config.forEach((item) => {
                // 校验
                if(item.required && !args[item.index]){
                    throw new Error(item.key + ' is required')
                }
                if(args[item.index] !== undefined){
                    params[item.key] = args[item.index];
                    if(item.type === 'int'){
                        params[item.key] = parseInt(params[item.key]);
                    }
                }else{
                    if(item.default !== undefined){
                        // 默认值
                        params[item.key] = item.default();
                    }
                }
            })
            console.log("params:", params)
        }
        catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            const id = await this.getId(this.model + '_id');
            const newItem = {
                id,
                ...params
            }
            await this.basemodel.create(newItem);
            return({
                status: 1,
                success: 'SUCCESS',
                response: {
                    id
                }
            })
        }catch(err){
            console.log('add', err.message);
            return({
                status: 0,
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 删除
     * @param {*} id 
     */
    async remove(id){
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id',
            }) 
        }
        try{
            await this.basemodel.findOneAndRemove({id});
            return({
                status: 1,
                success: 'SUCCESS'
            })
        }
        catch (err){
            console.log(this.model + ' delete', err.message);
            return({
                type: 'ERROR_DB',
                message: err.message
            })
        }
    }

    /**
     * 获取单个
     * @param {*} id 
     */
    async get(id){
        if(!id || !Number(id)){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'invalid id'
            })
        }
        try{
            const item = await this.basemodel.findOne({id}, this.cols);
            return({
                status: 1,
                type: 'SUCCESS',
                response: item
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
     * 更新
     * @param {*} id 
     * @param {*} args 
     */
    async update(id, ...args){
        let params = {};
        try{
            if(!id){
                throw new Error('invalid id')
            }
            // 如果没有声明 cols_config_edit 则使用 cols_config
            const _config = this.cols_config_edit ? this.cols_config_edit : this.cols_config;
            _config.map((item) => {
                if(item.required && !args[item.index]){
                    throw new Error(item.key + ' is required')
                }
                if(args[item.index] !== undefined){
                    params[item.key] = args[item.index];
                    if(item.type === 'int'){
                        params[item.key] = parseInt(params[item.key]);
                    }
                }else{
                    if(item.default !== undefined){
                        // 默认值
                        params[item.key] = item.default();
                    }
                }
            })
        }catch(err){
            return({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
        }
        try{
            const item = {
                ...params
            }
            await this.basemodel.update({id}, item);
            return({
                status: 1,
                success: 'SUCCESS'
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
    
}