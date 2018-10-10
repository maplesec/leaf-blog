import { createApp } from './app'
import axios from './services/axios'

let sid = '';
axios.interceptors.request.use(
    config => {
        config.headers['Cookie'] = 'SID=' + sid;
        return config
    },
    err => {
        
    }
)

// const { JSDOM }  = require("jsdom");
// const dom = new JSDOM('<!doctype html><html><body></body></html>',
// { url: 'http://localhost' })

// global.window = dom.window;
// global.document = window.document;
// global.navigator = window.navigator;

export default context => {
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp()
        
        let _url = context.url;
        // 路由守卫
        if(context.url.indexOf('/admin') === 0){
            // 管理员身份刷新，继承cookie，免登陆
            sid = context.cookies.SID;
        }else{
            sid = '';
        }
        router.push(_url)


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
