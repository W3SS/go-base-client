// import storage from 'localforage'
// import merge from 'lodash.merge'

// const KEY = 'vuex'

// export default async (store) => {
//   const savedState = await storage.getItem(KEY)
//   setTimeout(f => {
//     const newState = merge({}, store.state, savedState)
//     store.replaceState(newState)
//   }, 100)

//   store.subscribe((mutation, state) => {
//     storage.setItem(KEY, state)
//   })
// }

import {LocalStorage} from 'quasar'
import merge from 'lodash.merge'

const KEY = 'vuex'

export default async (store) => {
  const savedState = await LocalStorage.get.item(KEY)
  // setTimeout(f => {
  const newState = merge({}, store.state, savedState)
  store.replaceState(newState)
  // }, 50)

  store.subscribe((mutation, state) => {
    LocalStorage.set(KEY, state)
  })
}
