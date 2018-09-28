import User from '../controller/acl_user';
import Role from '../controller/acl_role';
import Resource from '../controller/acl_resource';
import ResourceData from './resource';
import RoleData from './role';
import UserData from './user';
import user from './user';

async function init(){
    // 根据是否有用户判断是否需要初始化 
    // TODO： 更全面地判断如何初始化
    const userlist = await User.list();
    if(userlist.response.totalCount===0){
        ResourceData.map(async function(item){
            await Resource.addResource(item.id, item.name);
        })
        const role_res = await Role.addRole(RoleData.name, RoleData.allows);
        await User.addUser(UserData.account, UserData.name, UserData.password, [role_res.response.id]);
        console.log('初始化数据完毕')
    }else{
        console.log('不需要初始化数据')
    }
}

export default init;

