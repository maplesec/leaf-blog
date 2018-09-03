const app = {
  namespaced: true,
  state: {
    sidebar: {
      opened: false
    },
    profile: {
      needCheckLogin: true,
      id: null,
      name: null,
      account: null,
      permissions: {},
      roles: []
    }
  },
  getters: {
    sidebar: (state) => {
      return state.sidebar
    },
    profile: (state) => {
      return state.profile
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        // TODO: 写入cookie
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    SET_PROFILE: (state, userInfo) => {
      state.profile = {...state.profile, ...userInfo};
    },
    CHECK_LOGIN: (state) => {
      state.profile.needCheckLogin = false;
    }
  },
  actions: {
    toggleSideBar({ commit }){
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { widthoutAnimation }) {
      commit('CLOSE_SIDEBAR', widthoutAnimation)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setProfile({ commit }, userInfo) {
      commit('SET_PROFILE', userInfo)
    },
    checkLogin({ commit }) {
      commit('CHECK_LOGIN');
    }
  }

}

export default app
