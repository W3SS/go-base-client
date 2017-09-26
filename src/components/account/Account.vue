<template lang="pug">
q-card
  q-card-main
    q-field(icon="account_box" label="Name", :error="$v.editAccount.name.$error", :error-label="'Minimum ' + $v.editAccount.name.$params.minLength.min + ' characters'")
      q-input(v-if="edit" v-model.trim="editAccount.name" @input="$v.editAccount.name.$touch()" placeholder="Name")
      span(v-else) {{account.name}}
    q-field(icon="mail" label="Email", :error="$v.editAccount.email.$error" error-label="Not a valid email address")
      q-input(v-if="edit" v-model.trim="editAccount.email" @input="$v.editAccount.email.$touch()" placeholder="Email Address")
      span(v-else) {{account.email}}
    q-field(v-if="!edit" icon="supervisor_account" label="Roles" )
      span(v-for="role in account.roles")
        q-chip.on-left(:color="role === 'admin' ? 'red': 'secondary'") {{role}}

  q-card-actions.float-right
    q-btn(v-if="!edit" @click="edit = true") Edit
    q-btn.float-right(v-if="edit" @click="cancelEdit") Cancel
    q-btn.on-right(v-if="edit" @click="updateAccount", :disabled="$v.editAccount.$invalid" color="primary") Save
</template>

<script>
import {QBtn, QCard, QCardActions, QCardTitle, QCardMain, QCardSeparator, QChip, QField, QInput} from 'quasar'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  components: {QBtn, QCard, QCardActions, QCardTitle, QCardMain, QCardSeparator, QChip, QField, QInput},
  props: [
    'account'
  ],
  data () {
    return {
      edit: false,
      editAccount: Object.assign({}, this.account)
    }
  },
  validations: {
    editAccount: {
      name: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      }
    }
  },
  watch: {
    account () {
      this.editAccount = Object.assign({}, this.account)
    }
  },
  methods: {
    updateAccount () {
      this.axios.put('/api/account', this.editAccount).then(res => {
        this.$emit('update-account', res.data)
      })
      this.edit = false
    },
    cancelEdit () {
      this.edit = false
      this.$v.editAccount.$reset()
    }
  }
}
</script>
