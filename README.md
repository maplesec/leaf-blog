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

ttl证书使用记录

1. 阿里云云盾->证书->购买证书

2. 品牌 Symantec， 保护类型选择1个域名， 证书类型选择免费DV

3. 订单提交后，补全个人信息， 其中域名验证类型我选择了文件

4. 验证主机，大体的思路为，下载fileauth.txt文件并存放到主机的nginx访问路径下，使用特定的网址能打开文件，则验证就能通过

5. 云盾证书已签发，可以按照教程配置nginx


设计模式

## 工厂模式



## 构造函数模式

ECMAScript中构造函数可以用来创建特定对象，类似于Array，Date等原生的js对象

function Student(name,age,classa){
 this.name=name;
 this.age=age;
 this.classa=classa;
 this.sayHello=function(){
  console.log(this.name,this.age,this.classa);
 }
}
var me=new Student("xiaoai",22,"大三");
console.log(me.classa);
me.sayHello();
console.log(me instanceof Student);//true

由代码可以看出，于工厂模式除了函数名不同以外，还要注意：构造函数名的首字母大写（不过好像没有严格规定）。构造函数也没有显示创建的对象，使用了this，直接把属性和方法赋值给了this对象。没有return语句，实例化的时候要使用new，而且它能够识别对象（这正是构造函数模式胜于工厂模式的地方）。

构造函数虽然好用，但也有很大的缺点，就是每次创建实例的时候都要重新创建一次方法，实际应用中，每次创建对象的时候属性值不同，而对象的方法却是相同的，所以创建两次完全相同的方法是没有必要的，因此有人会说可以把函数方法放到对象外面。如下：

function Student(name,age,classa){
 this.name=name;
 this.age=age;
 this.classa=classa;
 
}
function sayHello(){
  console.log(this.name,this.age,this.classa);
 }
var me=new Student("xiaoai",22,"大三");
console.log(me.classa);
me.sayHello();
console.log(me instanceof Student);

这样一改，就把sayhello函数设置成了全局函数，这样一来Student的每一个实例访问的都是同一个函数，可是，在全局作用域中定义一个只供student使用的函数，就显得有些过分了，如果在全局作用域中定义许多这样仅供特定对象使用的方法，那就太浪费空间了，显然也失去了面向对象所注重的封装性了，因此完全可以使用原型解决这个问题。

## 工厂模式

工厂从其预期目的获得了名称,简化了对象的创建,简单的工厂抽象出新关键字的所有这些用法,以便如果该类名更改或替换为不同的名称,则只需要在一个位置更改它。此外，它还建立了一个一站式服务,用于创建许多不同类型的对象或具有不同选项的单一对象类型,标准规范有点难以用这么少的话来解释,所以我稍后再说一遍

简单的工厂
var CarFactory = {
    makeCar: function(features) {
        var car = new Car();
        // If they specified some features then add them
        if (features && features.length) {
            var i = 0,
                l = features.length;
            // iterate over all the features and add them
            for (; i < l; i++) {
                var feature = features[i];
                switch(feature) {
                    case 'powerwindows':
                        car = new PowerWindowsDecorator(car);
                        break;
                    case 'powerlocks':
                        car = new PowerLocksDecorator(car);
                        break;
                    case 'ac':
                        car = new ACDecorator(car);
                        break;
                }
            }
        }
        return car;
    }
}

标准的工厂

var CarShop = function(){};
CarShop.prototype = {
    sellCar: function (type, features) {
        var car = this.manufactureCar(type, features);

        getMoney(); // make-believe function
        return car;
    },
    decorateCar: function (car, features) {
        /*
        Decorate the car with features using the same
        technique laid out in the simple factory
        */
    },
    manufactureCar: function (type, features) {
        throw new Error("manufactureCar must be implemented by a subclass");
    }
};

子类

/* Subclass CarShop and create factory method */
var JoeCarShop = function() {};
JoeCarShop.prototype = new CarShop();
JoeCarShop.prototype.manufactureCar = function (type, features) {
    var car;
    // Create a different car depending on what type the user specified
    switch(type) {
        case 'sedan':
            car = new JoeSedanCar();
            break;
        case 'hatchback':
            car = new JoeHatchbackCar();
            break;
        case 'coupe':
        default:
            car = new JoeCoupeCar();
    }

    // Decorate the car with the specified features
    return this.decorateCar(car, features);
};
/* Another CarShop and with factory method */
var ZimCarShop = function() {};
ZimCarShop.prototype = new CarShop();
ZimCarShop.prototype.manufactureCar = function (type, features) {
    var car;
    // Create a different car depending on what type the user specified
    // These are all Zim brand
    switch(type) {
        case 'sedan':
            car = new ZimSedanCar();
            break;
        case 'hatchback':
            car = new ZimHatchbackCar();
            break;
        case 'coupe':
        default:
            car = new ZimCoupeCar();
    }
    // Decorate the car with the specified features
    return this.decorateCar(car, features);
};



## A 单例模式

单体模式思想在于保证一个特定类仅有一个实例，意味着当你第二次使用同一个类创建信对象时，应得到和第一次创建对象完全相同

`
var Single;
(function(){
    var instance;
    Single = function(){
        if(!instance){
            instance = this;
        }
        return instance;
    }
})()

var s1 = new Single();

Single.prototype.a = 1;

var s2 = new Single();

console.log(s1 === s2);

console.log(s1.a);

console.log(s1.constructor === Single);
`

## B 工厂模式
工厂模式是为了创建对象。
`
function CarMaker(){}
CarMaker.prototype.drive = function(){
    return "I have " + this.doors + " doors";
}
CarMaker.compact = function(){
    this.doors = 4;
}
CarMaker.convertible = function(){
    this.doors = 2;
}
CarMaker.suv = function(){
    this.doors = 6;
}
CarMaker.factory = function(type){
    if(typeof CarMaker[type] !== "function"){
        throw "Error"
    }
    if(typeof CarMaker[type].prototype.drive !== "function"){
        CarMaker[type].prototype = new CarMaker();
    }
    var newCar = new CarMaker[type]();
    return newCar;
}
var corolla = CarMaker.factory('compact');
console.log(corolla.drive());
`

## 适配器模式

适配器模式允许你将接口转换成(或适应)你的需要,这个可以通过创建另一个具有所需接口的对象来实现,并连接到你想要改变的接口对象

实例：改写console

var AjaxLoggerAdapter = {
log: function() {
    AjaxLogger.sendLog(arguments);
},
info: function() {
    AjaxLogger.sendInfo(arguments);
},
debug: function() {
    AjaxLogger.sendDebug(arguments);
},...
};

window.console = AjaxLoggerAdapter;


## C 迭代器模式 
有一个包含某种数据集合的对象，该数据可能存储在一个复杂数据结构内部，而要提供一个简单方法讷讷感访问到数据结构中每一个元素

`
var agg = (function(){
    var index = 0;
    var data = [1, 2, 3, 4, 5, 6];
    var length = data.length;
    return {
        next: function(){
            if(!this.hasNext()){
                return null;
            }
            var element = data[index];
            index ++;
            return element;
        },
        hasNext: function(){
            return index < length;
        },
        reWind: function(){
            index = 0;
        },
        current: function(){
            return data[index];
        }
    }
})();

while(agg.hasNext()){
    console.log(agg.next());
}
agg.reWind();
`

## D 装饰器
可以在运行时候添加附加功能到对象中，他的一个方便特征在于其预期行为的可定制和可配置特性。

`
var Car = function() {
    console.log('Assemble: build frame, add core parts');
};
 
// The decorators will also need to implement this interface
Car.prototype = {
    start: function() {
        console.log('The engine starts with roar!');
    },
    drive: function() {
        console.log('Away we go!');
    },
    getPrice: function() {
        return 11000.00;
    }
};
`

var CarDecorator = function(car) {
    this.car = car;
};
 
// CarDecorator implements the same interface as Car
CarDecorator.prototype = {
    start: function() {
        this.car.start();
    },
    drive: function() {
        this.car.drive();
    },
    getPrice: function() {
        return this.car.getPrice();
    }
};


var PowerLocksDecorator = function(car) {
    // Call Parent Constructor
    CarDecorator.call(this, car);
    console.log('Assemble: add power locks');
};
PowerLocksDecorator.prototype = new CarDecorator();
PowerLocksDecorator.prototype.drive = function() {
    // You can either do this
    this.car.drive();
    // or you can call the parent's drive function:
    // CarDecorator.prototype.drive.call(this);
    console.log('The doors automatically lock');
};
PowerLocksDecorator.prototype.getPrice = function() {
    return this.car.getPrice() + 100;
};
var PowerWindowsDecorator = function(car) {
    CarDecorator.call(this, car);
    console.log('Assemble: add power windows');
};
PowerWindowsDecorator.prototype = new CarDecorator();
PowerWindowsDecorator.prototype.getPrice = function() {
    return this.car.getPrice() + 200;
}; 
var AcDecorator = function(car) {
    CarDecorator.call(this, car);
    console.log('Assemble: add A/C unit');
};
AcDecorator.prototype = new CarDecorator();
AcDecorator.prototype.start = function() {
    this.car.start();
    console.log('The cool air starts blowing.');
};
AcDecorator.prototype.getPrice = function() {
    return this.car.getPrice() + 600;
};



var car = new Car(); // log "Assemble: build frame, add core parts"
// give the car some power windows
car = new PowerWindowDecorator(car);// log "Assemble: add power windows"
// now some power locks and A/C
car = new PowerLocksDecorator(car); // log "Assemble: add power locks"
car = new AcDecorator(car); // log "Assemble: add A/C unit"
// let's start this bad boy up and take a drive!
car.start(); // log 'The engine starts with roar!' and 'The cool air starts blowing.'
car.drive(); // log 'Away we go!' and 'The doors automatically lock'




## E 策略模式
策略模式支持在运行时候选择算法。例如用在表单验证问题上，可以创建一个具有 validate() 方法的验证器对象，无论表单具体类型是什么，该方法都会被调用，
并且返回结果或者错误信息。



## 发布订阅模式

var EventCenter = (function(){
    var events = {};
    /*
    {
      my_event: [{handler: function(data){xxx}}, {handler: function(data){yyy}}]
    }
    */
    return {
        on: function(evt, handler){
            events[evt] = events[evt] || [];
            events[evt].push({
                handler: handler
            })
        },
        fire: function(evt, arg){
            if(!events[evt]){
                return
            }
            for(var i=0; i < events[evt].length; i++){
                events[evt][i].handler(arg);
            }
        },
        off: function(evt){
            delete events[evt];
        }
    }
})();

var number = 1;
EventCenter.on('click', function(data){
    console.log('click' + data);
})

// EventCenter.off('click');

EventCenter.on('click', function(data){
    console.log('click' + data);
})

EventCenter.fire('click', 'bind')

