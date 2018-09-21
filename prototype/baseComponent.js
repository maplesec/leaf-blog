import Ids from '../models/ids'

export default class BaseComponent{
    constructor(){
        this.idList = ['address_id','user_id','role_id','resource_id','draft_id','category_id'];
    }
    async getId(type){
        if(!this.idList.includes(type)){
            console.log('id类型错误');
            throw new Error('id类型错误');
            return
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
}