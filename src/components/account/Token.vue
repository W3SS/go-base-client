<template lang="pug">
q-list(link separator no-border)
  q-list-header Active Logins
  q-item(v-for="t in token", :key="t.id")
    q-item-side(left :icon="t.mobile ? 'phone_iphone' : 'desktop_mac'")
    q-item-main(@click="edit(t)")
      q-item-tile(label) {{t.identifier}}
      q-item-tile(sublabel) Last Login: {{formatDate(t.updated_at)}}
    q-item-side(right)
      q-item-tile(v-if="localTokenID === t.id" label) This Device
      q-btn(v-else @click="deleteToken(t.id)" color="red" flat) Logout
</template>

<script>
import {date, Dialog, QBtn, QList, QListHeader, QIcon, QItem, QItemMain, QItemSide, QItemSeparator, QItemTile} from 'quasar'

const {formatDate} = date

export default {
  name: 'token',
  components: {QBtn, QList, QListHeader, QIcon, QItem, QItemMain, QItemSide, QItemSeparator, QItemTile},
  props: [
    'token'
  ],
  computed: {
    localTokenID () { return this.$auth.refreshTokenID }
  },
  methods: {
    formatDate (d) {
      // return getDateDiff(Date.now(), date)
      return formatDate(d, 'YYYY-MM-DD HH:mm')
    },
    edit (token) {
      Dialog.create({
        title: 'Edit Identifier',
        form: {
          identifier: {
            type: 'text',
            // label: 'Identifier',
            model: token.identifier
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Save',
            outline: true,
            handler: (data) => {
              this.updateToken(token.id, data)
            }
          }
        ]
      })
    },
    updateToken (id, data) {
      let token = this.token.find(t => t.id === id)
      token.identifier = data.identifier
      this.axios.put('/api/account/token/' + id, token).then(() => {
        this.$emit('update-token', token)
      })
    },
    deleteToken (id) {
      this.axios.delete('/api/account/token/' + id).then(() => {
        this.$emit('delete-token', id)
      })
    }
  }
}
</script>
