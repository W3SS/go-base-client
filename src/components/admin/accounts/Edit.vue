<template lang="pug">
div(v-if="account")
  account-form(:account="editAccount")
    div(slot="title") Edit {{account.name}}
    .on-right(slot="actions")
      q-btn(@click="cancelUpdate") Cancel
      q-btn.on-right(@click="updateAccount", :disabled="loading" color="primary") Update
</template>

<script>
import AccountForm from './Form'
import { Toast, QBtn, QModal } from 'quasar'

export default {
  components: {
    AccountForm,
    QBtn,
    QModal
  },
  props: ['account'],
  data () {
    return {
      editAccount: Object.assign({}, this.account),
      loading: false
    }
  },
  methods: {
    updateAccount () {
      this.loading = true
      this.axios.put('/admin/accounts/' + this.account.id, this.editAccount).then(res => {
        this.$emit('accountUpdated', res.data)
        // this.clearForm()
        Toast.create.positive({html: 'Account updated'})
      }, err => {
        Toast.create.negative({html: err.response.data.error})
      })
      this.loading = false
    },
    cancelUpdate () {
      this.$emit('cancelUpdate')
    }
  }
}
</script>

<style lang="stylus">
.editAccount {
  padding: 25px
}
</style>
