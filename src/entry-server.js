import { createApp } from './app'
import axios from './services/axios'

export default context => {
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp()

        let _url = context.url;
        console.log('session:', context.cookies)
        // 路由守卫
        if(context.url.indexOf('/admin') === 0){
            // 管理员页面，需要认证
            // 用session覆盖axios的配置
            axios.interceptors.request.use(
                config => {
                    config.headers['Cookie'] = 'SID=' + context.cookies.SID
                    return config
                },
                err => {
                    return Promise.reject(err)
                }
            )
            // 根据session判断用户是否已经登录
            const profile_api = axios.get('/acl_user/profile',{
                headers: {
                    'Cookie': 'SID=' + context.cookies.SID
                }
            });
            (profile_api).then(res => {
                console.log(JSON.stringify(res.data))
                if (res.data && res.data.status === 1) {
                    store.dispatch('app/setProfile', res.data.response);
                    store.dispatch('app/checkLogin')
                    // 已登录
                    router.push(_url)
                } else {
                    // 跳转到登录页面
                    console.log('login error1')
                    router.push('/login');
                }
            }, err => {
                // 跳转到登录页面
                console.log('login error2')
                router.push('/login');
            })


        }else{
            // 设置服务器端 router 的位置
            router.push(_url)
        }

    
        

        // 等到 router 将可能的异步组件和钩子函数解析完
        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
            // 匹配不到的路由，执行 reject 函数，并返回 404
            if (!matchedComponents.length) {
                return reject({ code: 404 })
            }

            // 对所有匹配的路由组件调用 `asyncData()`
            Promise.all(matchedComponents.map(Component => {
                if (Component.asyncData) {
                    return Component.asyncData({
                        store,
                        route: router.currentRoute
                    })
                }
            })).then(() => {
                // 在所有预取钩子(preFetch hook) resolve 后，
                // 我们的 store 现在已经填充入渲染应用程序所需的状态。
                // 当我们将状态附加到上下文，
                // 并且 `template` 选项用于 renderer 时，
                // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
                context.state = store.state

                resolve(app)
            }).catch(reject)
        }, reject)
    })
}
