import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/Login.vue'
import Layout from '@/Layout.vue'
import Account from '@/account/Index.vue'
import Hello from '@/Hello.vue'

Vue.use(VueRouter)

/*
 * Uncomment this section and use "load()" if you want
 * to lazy load routes.
*/
function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  mode: 'history',
  routes: [
    { path: '/login', component: Login },
    { path: '/login/:token', component: Login },

    { path: '/',
      component: Layout,
      children: [
        { path: '', component: Hello }
      ]
    },

    // Account
    { path: '/account',
      component: Layout,
      meta: { auth: true },
      children: [
        { path: '', component: Account }
      ]
    },

    // Admin
    { path: '/manage',
      // name: 'Admin', // no name if other component is set as default by empty path ''
      component: load('admin/Layout'),
      meta: { auth: { adminOnly: true } },
      children: [
        { path: '', component: load('admin/Dashboard') },
        { path: 'accounts', component: load('admin/accounts/Index') } // , meta: { auth: { scope: ['useradmin'] } } } // needs admin and useradmin role
      ]
    }
  ]
})
