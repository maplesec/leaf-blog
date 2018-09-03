import Vue from 'vue';
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import { createRouter } from './router'
import axios from './services/axios'
import prototypeFunc from './utils/prototypeFunc'
import { createStore } from './store'
import i18n from './lang'
import { sync } from 'vuex-router-sync'
import ElementUI from 'element-ui';

Vue.use(ElementUI)
Vue.use(prototypeFunc)

export function createApp(){
    const router = createRouter()
    const store = createStore()
    // 同步路由状态(route state)到 store
    sync(store, router)

    // router.beforeEach(function(to, from, next) {
    //     console.log('to:', to, from)
    //     console.log('beforeEach')
    //     // 普通页面无需登录
    //     if(to.fullPath.indexOf('/admin') !== 0){
    //         next();
    //         return;
    //     }
    //     // admin开始的路由，首次打开admin网页,根据接口判断是否免登陆
    //     // TODO: 判断具体页面的权限
    //     if(store.getters['app/profile'].needCheckLogin){
    //         // ssr 自动登陆存在问题
    //         // TODO: 自动登陆的逻辑放在web实现
    //         // next('/login');
    //         // return;

    //         const profile_api = axios.get('/acl_user/profile');
    //         (profile_api).then(res => {
    //             console.log("profile#########", JSON.stringify(res.data))
    //             if (res.data && res.data && res.data.status === 1) {
    //                 store.dispatch('app/setProfile', res.data.response);
    //                 store.dispatch('app/checkLogin')
    //                 next();
    //             } else {
    //                 console.log(res.data.status === 1);
    //                 console.log('next1', from, to)
    //                 next('/login');
    //             }
    //         }, err => {
    //             console.log('next2')
    //             next('/login');
    //         })
    //     }else{
    //         next();
    //     }
    // })

    const app = new Vue({
        render: h => h(App),
        i18n,
        router,
        store,
        axios,
    })
    return { app, router, store }
}
