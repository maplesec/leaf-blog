import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import tagsView from './modules/tagsView'
import user from './modules/user'
import role from './modules/role'
import resource from './modules/resource'
import article from './modules/article'
import draft from './modules/draft'
import category from './modules/category'

Vue.use(Vuex)
export function createStore () {
    const store = new Vuex.Store({
        modules: {
            app,
            tagsView,
            user,
            role,
            resource,
            article,
            draft,
            category,
        },
        getters: {
            visitedViews: state => state.tagsView.visitedViews,
            cachedViews: state => state.tagsView.cachedViews,
        }
    })
    return store;
}
