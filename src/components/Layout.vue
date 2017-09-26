<template lang="pug">
q-layout(ref="layout", view="hHh Lpr lff" reveal)
  q-toolbar(slot="header" inverted)
    q-btn(flat @click='$refs.layout.toggleLeft()')
      q-icon(name='menu')
    q-toolbar-title GoBase
    q-fab(v-if="$auth.isAuthenticated" icon="account_circle" direction="left" flat color="secondary")
      q-fab-action(@click="$router.push('/account')" icon="settings")
        q-tooltip(:offset="[10, 10]") Settings
      q-fab-action(@click="logout" icon="power_settings_new" color="red")
        q-tooltip(:offset="[10, 10]") Logout
    q-btn(v-else @click="$router.push('/login')" color="primary")
      q-icon(name="account_box")
      q-tooltip(:offset="[10, 0]" anchor="center right" self="center left") Login

  div(slot='left')
    q-side-link(item, to="/")
      q-item-side(icon='home')
      q-item-main(label='Home')
    q-list(v-if="$auth.hasRole('admin')" link)
      q-list-header Admin Panel
      q-side-link(item to="/manage")
        q-item-side(icon='dashboard')
        q-item-main(label='Dashboard')
      q-side-link(item to="/manage/accounts")
        q-item-side(icon='supervisor_accounts')
        q-item-main(label='Accounts')

  .layout-padding
    router-view
</template>

<script>
import { QFab, QFabAction, QFixedPosition, QLayout, QToolbar, QToolbarTitle, QTooltip, QBtn, QIcon, QList, QListHeader, QItem, QItemMain, QItemSide, QSideLink } from 'quasar'

export default {
  components: { QFab, QFabAction, QFixedPosition, QLayout, QToolbar, QToolbarTitle, QTooltip, QBtn, QIcon, QList, QListHeader, QItem, QItemMain, QItemSide, QSideLink },
  methods: {
    logout () {
      this.$auth.logout()
    }
  }
}
</script>
<style lang="stylus">
@import '~variables'
.layout-header
  background-color $white
</style>
