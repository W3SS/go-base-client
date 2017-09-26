import authStore, {setConfig} from './store'
import {mapState} from 'vuex'
const plugin = {

  defaults: {
    baseUrl: '/auth',
    loginUrl: '/login',
    tokenUrl: '/token',
    refreshUrl: '/refresh',
    logoutUrl: '/logout',

    loginPath: '/login',
    logoutRedirect: '/',
    unauthorizedRedirect: '/403',

    tokenKeys: {
      access: 'access_token',
      refresh: 'refresh_token'
    },
    refreshThresholdMin: 30,
    refreshThresholdMax: 60,
    roles: {
      admin: 'admin'
    }
  },

  install (Vue, options) {
    if (plugin.installed) {
      console.error('jwt plugin already installed')
      return
    }
    console.log('auth plugin setup')
    // console.log(options)

    let opts = Object.assign(plugin.defaults, options.params)
    setConfig(opts)
    options.store.registerModule('auth', authStore)
    let router = options.router
    let store = options.store

    var vm = new Vue({
      router,
      store,
      data: {
        refreshIn: 0,
        refreshTimer: null
      },
      computed: {
        ...mapState([
          'auth'
        ]),
        sub () {
          return this.auth.user.sub
        },
        isAuthenticated () {
          return this.tokenValid
        },
        tokenValid () {
          return this.expiresIn > 0
        },
        expiresIn () {
          return this.auth.access.exp * 1000 - Date.now()
        },
        refreshValid () {
          return this.refreshExpiresIn > 0
        },
        refreshExpiresIn () {
          return this.auth.refresh.exp * 1000 - Date.now()
        },
        canRefresh () {
          return this.refreshValid
        },
        refreshTokenID () {
          return this.auth.refresh.id
        }
      },

      watch: {
        isAuthenticated: function () {
          console.log('authenticated:', this.isAuthenticated)
        },
        expiresIn: function () {
          clearTimeout(this.refreshTimer)
          let threshold = Math.floor(Math.random() * (opts.refreshThresholdMax - opts.refreshThresholdMin)) + opts.refreshThresholdMin
          this.refreshIn = this.expiresIn - threshold * 1000 // ms
        },
        refreshIn: function () {
          console.log('refresh in:', Math.floor(this.refreshIn / 1000) + ' seconds')
          this.refreshTimer = setTimeout(() => {
            if (this.canRefresh) {
              refreshToken()
            }
            else {
              this.$store.dispatch('localLogout')
            }
          }, this.refreshIn)
        }
      },

      methods: {
        requestLoginToken (email) {
          return new Promise((resolve, reject) => {
            this.$store.dispatch('requestLoginToken', email).then(() => {
              resolve()
            }, err => {
              reject(err)
            })
          })
        },
        requestToken (token) {
          return new Promise((resolve, reject) => {
            this.$store.dispatch('requestToken', token).then(() => {
              resolve()
            }, err => {
              reject(err)
            })
          })
        },
        logout () {
          this.$store.dispatch('logout')
          this.$router.push(opts.logoutRedirect)
        },
        localLogout () {
          this.$store.dispatch('localLogout')
        },
        hasRole (role) {
          return this.auth.user.roles.includes(role)
        },
        hasAnyRole (roles) {
          let ok = false
          roles.forEach(r => {
            if (this.hasRole(r)) ok = true
          })
          return ok
        },
        accessTokenHeader () {
          return 'Bearer ' + this.auth.access.token
        },
        refreshTokenHeader () {
          return 'Bearer ' + this.auth.refresh.token
        }
      },

      created () {
        // setTimeout(() => {
        //   console.log('auth mounted')
        // }, 500)
      }
    })

    let self = Vue.prototype.$auth = vm
    let axios = Vue.axios

    function refreshToken () {
      self.$store.dispatch('refreshToken').then(() => {
        console.log('refresh success')
      }, err => {
        console.log('failed token refresh:', err)
      })
    }

    function uri (endpoint) {
      return opts.baseUrl + opts[endpoint + 'Url']
    }

    // setup axios interceptors

    if (!axios) {
      console.error('axios not found - set Vue.use(axios) before using this plugin')
    }
    else {
      axios.interceptors.request.use(config => {
        if (config.url === uri('refresh') || config.url === uri('logout')) {
          config.headers['Authorization'] = self.refreshTokenHeader()
        }
        else {
          config.headers['Authorization'] = self.accessTokenHeader()
        }
        return config
      }, error => {
        return Promise.reject(error)
      })

      axios.interceptors.response.use(response => {
        return response
      }, error => {
        if (error.response.status === 401) {
          console.log(error.response)
          console.log('Unauthorized request => local logout')
          self.localLogout()
          router.push(opts.logoutRedirect)
        }
        return Promise.reject(error)
      })
    }

    // setup router interceptors
    if (!router) {
      console.error('no router passed to auth options during setup')
    }
    else {
      router.beforeEach((to, from, next) => {
        let requiresAuth = to.matched.some(record => record.meta.auth)
        if (requiresAuth) {
          let adminOnly = to.matched.some(record => {
            return record.meta.auth ? record.meta.auth.adminOnly : false
          })
          let requiresRole = to.meta.auth ? (Array.isArray(to.meta.auth.scope) ? to.meta.auth.scope : false) : false

          if (!self.isAuthenticated) {
            next({
              path: opts.loginPath,
              query: { redirect: to.fullPath }
            })
          }
          else if (adminOnly && !self.hasRole(opts.roles.admin)) {
            next(opts.unauthorizedRedirect)
          }
          else if (requiresRole && !self.hasAnyRole(requiresRole)) {
            next(opts.unauthorizedRedirect)
          }
          else next()
        }
        else next()
      })
    }
  }
}

export default plugin
