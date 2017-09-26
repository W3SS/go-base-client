import Vue from 'vue'
import Vuex from 'vuex'
// import {LocalStorage} from 'quasar'
// import createPersistedState from 'vuex-persistedstate'
import persistState from './persist'
import createMutationsSharer from 'vuex-shared-mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true, // process.env.NODE_ENV !== 'production',
  plugins: [persistState, createMutationsSharer({predicate: ['setToken', 'logout']})],
  // plugins: [
  //   createPersistedState({
  //     paths: ['auth'],
  //     storage: {
  //       getItem: key => LocalStorage.get.item(key),
  //       setItem: (key, value) => LocalStorage.set(key, value),
  //       removeItem: key => LocalStorage.remove(key)
  //     }
  //   }),
  //   createMutationsSharer({predicate: ['setToken', 'logout']})
  // ],
  modules: {

  },
  state: {
    count: 1
  },
  mutations: {}
})

export default store
