<template lang="pug">
div
  h5
    slot(name="title")
  q-field(icon="account_box" label="Name", :error="$v.account.name.$error", :error-label="'Minimum ' + $v.account.name.$params.minLength.min + ' characters'")
    q-input(v-model.trim="account.name" @input="$v.account.name.$touch()" placeholder="Account Name")
  q-field(icon="mail" label="Email", :error="$v.account.email.$error" error-label="Not a valid email address")
    q-input(v-model.trim="account.email" @input="$v.account.email.$touch()" placeholder="Email Address")
  q-field(icon="supervisor_account" label="Roles", :error="$v.account.roles.$error" error-label="Choose at least one role")
    q-checkbox(v-model="account.roles" label="User" val="user" @focus="$v.account.roles.$touch()")
    q-checkbox.on-right(v-model="account.roles" label="Admin" val="admin")
  q-field(icon="check_circle" label="Active")
    q-toggle(v-model="account.active")
  .row.justify-end
    //- q-btn(@click="clearForm") Cancel
    slot(name="actions")
</template>

<script>
import { QBtn, QCheckbox, QCollapsible, QField, QIcon, QInput, QToggle } from 'quasar'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  components: {
    QBtn,
    QCheckbox,
    QCollapsible,
    QField,
    QIcon,
    QInput,
    QToggle
  },
  props: ['account'],
  data () {
    return {}
  },
  validations: {
    account: {
      name: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      },
      roles: {
        required,
        minLength: minLength(1)
      }
    }
  },
  methods: {
    clearForm () {
      this.$refs.createAccount.close()
      this.account = {
        name: '',
        email: '',
        roles: ['account'],
        active: true
      }
      this.$v.account.$reset()
    }
  }
}
</script>

<style lang="stylus">
</style>
