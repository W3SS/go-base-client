<template lang="pug">
q-tabs(slot='navigation' align='center' no-pane-border inverted)
  q-tab(default slot='title', name='account', label='Account', icon='account_box', hide='icon')
  q-tab(slot='title', name='profile', label='Profile', icon='view_day', hide='icon')
  q-tab(slot='title', name='token', label='Token', icon='vpn_key', hide='icon')

  q-tab-pane(name='account')
    account(:account="account" @update-account="receiveAccountData")
  q-tab-pane(name='profile')
    profile(:profile="profile" @update-profile="updateProfile")
  q-tab-pane(name='token')
    token(:token="token" @update-token="updateToken" @delete-token="deleteToken")
</template>

<script>
import {date, QTabs, QTab, QTabPane} from 'quasar'
import Profile from './Profile.vue'
import Account from './Account.vue'
import Token from './Token'

const {getDateDiff} = date

export default {
  components: {
    QTabs,
    QTab,
    QTabPane,

    Profile,
    Account,
    Token
  },
  data () {
    return {
      account: {},
      profile: {},
      token: []
    }
  },
  beforeMount () {
    this.axios.get('/api/account').then(res => {
      this.receiveAccountData(res.data)
    })
  },
  methods: {
    receiveAccountData (data) {
      let account = {
        email: data.email,
        name: data.name,
        roles: data.roles
      }
      this.account = account
      this.profile = data.profile

      data.token.sort((a, b) => {
        return getDateDiff(b.updated_at, a.updated_at, 'minutes')
      })
      this.token = data.token
    },
    updateProfile (profile) {
      this.profile = profile
    },
    updateToken (token) {
      let idx = this.token.findIndex(v => v.id === token.id)
      this.token[idx] = token
    },
    deleteToken (id) {
      this.token = this.token.filter(v => v.id !== id)
    }
  }
}
</script>

<style lang="stylus">

</style>
