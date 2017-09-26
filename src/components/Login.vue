<template lang="pug">
.layout-padding
  .row.justify-left
    q-btn(flat, @click="$router.go(-1)") Back
  .row.justify-center
    q-stepper.shadow-12(v-model='step' vertical)
      .row.justify-center
        h6 Login

      q-step(default, name='request', :error='errRequest', title='Email', subtitle='Account Email Address')
        q-input(v-model.trim='email', @keyup.enter='requestToken', placeholder='example@mail.org', :autofocus="step === 'email'", clearable)
        q-btn(flat, @click="step='verify'", icon='arrow_downward')
        q-btn(@click='requestToken', :disabled='$v.email.$invalid', color='primary', icon='mail') Get Token

      q-step(name='verify', :error='errVerify', title='Token', subtitle='Token from Email')
        q-input(ref='token', v-model.trim='token', @keyup.enter='verifyToken', placeholder='Token', :autofocus="step === 'verify'", clearable)
        q-btn(@click='verifyToken', :disabled='$v.token.$invalid', color='primary', icon='vpn_key') Login

//- alternative simple form
  .row.justify-center
    form(v-on:submit.prevent='requestToken')
      q-input(v-model='email', float-label='Email', autofocus)
        q-btn(type='submit', icon='mail') Request Token
  .row.justify-center
    form(v-on:submit.prevent='verifyToken')
      q-input(v-model='token', float-label='Token')
        q-btn(type='submit', icon='vpn_key') Login
</template>

<script>
import { QLayout, Toast, QStepper, QStepperNavigation, QStep, QInput, QBtn, QIcon } from 'quasar'
import { required, email, minLength } from 'vuelidate/lib/validators'

Toast.setDefaults({
  timeout: 3000
})

const errInvalidEmail = 'Invalid Email Address'
const successTokenRequest = 'Check your Emails for Token'

const errInvalidToken = 'Invalid Token'
const successTokenLogin = 'Login Success'

export default {
  components: {
    QLayout,
    QStepper,
    QStepperNavigation,
    QStep,
    QInput,
    QBtn,
    QIcon
  },
  data () {
    return {
      email: '',
      token: '',
      errRequest: false,
      errVerify: false,
      step: 'request'
    }
  },
  validations: {
    email: {
      required,
      email
    },
    token: {
      required,
      minLength: minLength(8)
    }
  },
  computed: {
    isAuthenticated () {
      return this.$auth.isAuthenticated
    }
  },
  watch: {
    isAuthenticated: function () {
      if (this.isAuthenticated) {
        this.$router.push(this.$route.query.redirect || '/')
      }
    }
  },
  methods: {
    requestToken () {
      if (this.$v.email.$invalid) {
        Toast.create.negative({ html: errInvalidEmail })
        this.errRequest = true
      }
      else {
        this.$auth.requestLoginToken(this.email).then(res => {
          Toast.create.positive({ html: successTokenRequest })
          this.errRequest = false
          this.step = 'verify'
        }).catch(() => {
          this.errRequest = true
          Toast.create.negative({ html: errInvalidEmail })
        })
      }
    },
    verifyToken () {
      if (this.$v.token.$invalid) {
        Toast.create.negative({ html: errInvalidToken })
        this.errVerify = true
      }
      else {
        this.$auth.requestToken(this.token).then(res => {
          Toast.create.positive({ html: successTokenLogin })
        }).catch(() => {
          this.errVerify = true
          Toast.create.negative({ html: errInvalidToken })
        })
      }
    },
    clearForm () {
      this.email = ''
      this.token = ''
      this.errRequest = false
      this.errVerify = false
    }
  },
  mounted () {
    this.token = this.$route.params.token
    if (!this.$v.token.$invalid) {
      this.verifyToken()
    }
  },
  beforeDestroy () {
    this.clearForm()
  }
}
</script>

<style lang="stylus">

</style>
