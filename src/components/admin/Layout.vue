<template lang="pug">
//- Configure "view" prop for QLayout
q-layout(ref="layout", view="hHh LpR lff", :left-class="{'bg-grey-2': true}")
  q-toolbar(slot="header")
    q-btn(flat, @click='$refs.layout.toggleLeft()')
      q-icon(name='menu')
    q-toolbar-title
      | Admin ({{$auth.sub}})
  //
    Navigation Tabs
    q-tabs(slot='navigation')
      q-route-tab(slot='title', icon='view_quilt', to='/admin/dashboard', replace, hide='icon', label='Dashboard')
      q-route-tab(slot='title', icon='view_day', to='/admin/user', replace, hide='icon', label='User')

  //
    Left Side Panel
  div(slot='left')
    q-side-link(item, to="/")
      q-item-side(icon='home')
      q-item-main(label='Home')
    q-list(no-border, link, inset-delimiter)
      q-list-header Admin Panel
      q-side-link(item, to="/manage")
        q-item-side(icon='dashboard')
        q-item-main(label='Dashboard')
      q-side-link(item, to="/manage/accounts")
        q-item-side(icon='supervisor_accounts')
        q-item-main(label='Accounts')
  //
    Right Side Panel
    div(slot='right')
      | ...
  router-view
  //
    Footer
    q-toolbar(slot='footer')
      | Footer...
</template>

<script>
import {
  QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QListHeader, QItem, QItemSide, QItemMain, QTabs, QRouteTab, QSideLink
} from 'quasar'

export default {
  components: {
    QLayout, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QListHeader, QItem, QItemSide, QItemMain, QTabs, QRouteTab, QSideLink
  },
  data () {
    return {}
  }
}
</script>

<style lang="stylus">
</style>
