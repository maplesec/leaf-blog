# leaf-blog
A blog system based on node, express, mongoose, node_acl, vue

# windows配置mongodb

1. 新建 mongo.config 文件如下
`
dbpath=C:\data\db
logpath=C:\data\log\mongo.log
auth=false
`
2. 管理员启动cmd, 输入命令
`mongod.exe --config mongo.config --install --serviceName "mongo"`

移除

`mongod.exe --remove --serviceName "mongo"`

# 启动mongo

`net start mongo`

# 添加管理员

mongo命令行
`
use admin
db.createUser({user:"root",pwd:"root",roles:["root"]})
`

# 添加数据库用户

`
use test
db.createUser({user:"test",pwd:"test",roles:[{role:"dbOwner",db:"test"}]})
use admin
db.system.users.find()
`

# 开启认证
mongo.config 中auth设置为true
数据库连接改为 mongodb://test:test@localhost/test

# node_acl

与mongoose配合, 必须使用mongoose中的db实例

node_acl的实质是处理user-role-resource之间的关系, 但是不直接管理他们本身


结果返回格式
{
    status: 0,
    type: 'ERROR_PARAMS',
    message: '错误详细描述'
    response: {
        totalCount: 100,
        result: []
    }
}
status:
1. 请求成功
2. 登录超时
0. 一般错误


 直接使用name作为/resource 的id

 TODAY TODO:
 规范返回格式
 规范报错内容
 查询增加分页
 增加查重接口
 完善接口聚合
 字段长度限制


 参考Monkvo
 mongoose 跨表查询
 jwt用户认证
 blog基本内容
 apicache高并发
 前后端整合
 区分admin以及client
 client不用登陆



 代码重构：
 1. global.acl 统一封装Promise
 2. controller只做函数，不做接口返回。 router做接口返回，以及catch errors
 3. web密码加密,写数据库密码再加密
 4. 初始化数据库脚本
 5. 密码错误多次，禁用账户


分层
# server 纯后端服务
controller, models, mongodb,  prototype, routes, server.js
# admin 纯前端服务
build, config, src : dev prod
# client SSR服务
build, config, src : dev server client
# dist
admin-dist
client-dist

文件上传
markdown编辑与展示

重构：
1. 封装数据校验
2. router做数据校验, 及请求返回
3. controller只做业务
4. get请求, 返回的字段做约束


系统上线
历时小半年，利用自己的业余时间，我的博客系统终于上线了。在这个过程中，边做边学边思考，然后重构代码，中间甚至忘了做这个项目的初衷，沉浸在玩代码的乐趣中😂

为什么要从头写博客系统

建议真正想写blog的同学，直接使用成熟的系统就好，不然你将花费大量的事件精力在建站和维护上，根本没时间写blog。
回到正题，这个blog系统其实是最近一个月才开始写的，之前花了很长的时间做RBAC的资源管理系统。于是就在RBAC系统的基础上，做了一个简单的blog。技术栈大致如下：
1. mongoose + mongodb
2. express
3. node_acl
4. vue + vuex + ssr
5. element ui
6. SSL证书 
7. docker 容器化
当中踩了不少的坑，后面会专门写文章来分享我的采坑经历。
我的github地址： 


1. mongodb 安装和基本命令

2. mongoose 基本用法

3. express 入门

4. node_acl采坑

5. vue ssr 改造实战

6. nginx 使用 SSL 证书

7. docker 