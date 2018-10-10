import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/layout'
import Customer from '@/views/customer/customer'

Vue.use(Router)

export function createRouter(){
    const router = new Router({
        mode: 'history',
        routes: [
            {
                path: '/admin/login',
                name: 'login',
                component: resolve => require(['@/views/login/index'], resolve)
            },
            {
                path: '/admin',
                name: 'layout',
                component: Layout,
                redirect: { name: 'user' },
                children: [
                    {
                        path: '/admin/role',
                        name: 'role',
                        component: resolve => require(['@/views/role/role'], resolve),
                        meta: {
                            title: '角色'
                        }
                    },
                    {
                        path: '/admin/user',
                        name: 'user',
                        component: resolve => require(['@/views/user/user'], resolve),
                        meta: {
                            title: '用户'
                        }
                    },

                    {
                        path: '/admin/resource',
                        name: 'resource',
                        component: resolve => require(['@/views/resource/resource'], resolve),
                        meta: {
                            title: '资源'
                        }
                    },
                    {
                        path: '/admin/draft',
                        name: 'draft',
                        component: resolve => require(['@/views/draft/draft'], resolve),
                        meta: {
                            title: '草稿'
                        }
                    },
                    {
                        path: '/admin/category',
                        name: 'category',
                        component: resolve => require(['@/views/category/category'], resolve),
                        meta: {
                            title: '类别'
                        }
                    },
                ]
            },
            {
                path: '/',
                name: 'root',
                redirect: { name: 'article'}
            },
            {
                path: '/article',
                name: 'customer',
                component: Customer,
                redirect: { name: 'article' },
                children: [
                    {
                        path: '/article',
                        name: 'article',
                        component: resolve => require(['@/views/article/list'], resolve),
                        meta: {
                            title: '文章'
                        }
                    },
                    {
                        path: '/article/:id',
                        name: 'article-detail',
                        component: resolve => require(['@/views/article/detail'], resolve),
                        meta: {
                            title: '文章详情'
                        }
                    }
                ]
            },

        ]
    })

    return router;
}
