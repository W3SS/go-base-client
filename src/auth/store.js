import Vue from 'vue'
import JWT from './jwt'

var config

export function setConfig (defaults, cfg) {
  config = Object.assign(defaults, cfg)
  // console.log(config)
}

function uri (endpoint) {
  return config.baseUrl + config[endpoint + 'Url']
}

const store = {
  state: {
    user: {
      sub: '',
      roles: []
    },
    access: {
      token: '',
      exp: 0
    },
    refresh: {
      id: null,
      token: '',
      exp: 0
    }
  },

  getters: {

  },

  actions: {
    requestLoginToken ({commit}, email) {
      let data = {email: email}
      Vue.axios.post(uri('login'), data)
    },
    requestToken ({commit}, token) {
      let data = {token: token}
      Vue.axios.post(uri('token'), data).then(res => {
        // console.log(res)
        commit('setToken', res.data)
      })
    },
    refreshToken ({commit, state}) {
      return new Promise((resolve, reject) => {
        Vue.axios.post(uri('refresh')).then(res => {
          // console.log(res)
          commit('setToken', res.data)
          resolve()
        }, err => {
          // commit('logout')
          reject(err)
        })
      })
    },
    localLogout ({commit}) {
      commit('logout')
    },
    logout ({commit}) {
      Vue.axios.post(uri('logout')).finally(() => {
        commit('logout')
      })
    }
  },
  mutations: {
    setToken (state, payload) {
      state.access.token = payload[config.tokenKeys.access]
      let accessToken = JWT.decode(state.access.token)
      state.access.exp = accessToken.exp

      state.user = {
        sub: accessToken.sub,
        roles: accessToken.roles
      }

      state.refresh.token = payload[config.tokenKeys.refresh]
      let refreshToken = JWT.decode(state.refresh.token)
      state.refresh.id = refreshToken.id
      state.refresh.exp = refreshToken.exp
    },
    logout (state) {
      console.log('logout')
      state.user = { sub: '', roles: [] }
      state.access = { token: '', exp: 0 }
      state.refresh = { token: '', exp: 0 }
    }
  }
}

export default store
