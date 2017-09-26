<template lang="pug">
.profile no visual functionality yet...
  q-field(icon="color_lens", label="Theme")
    q-select(v-model="editProfile.theme", :options="themes")
  q-btn.float-right(@click="updateProfile" color="primary") Save
</template>

<script>
import {QBtn, QField, QSelect} from 'quasar'

export default {
  components: {QBtn, QField, QSelect},
  props: [
    'profile'
  ],
  data () {
    return {
      themes: [
        {label: 'Default', value: 'default'},
        {label: 'Dark', value: 'dark'}
      ],
      editProfile: Object.assign({}, this.profile)
    }
  },
  watch: {
    profile () {
      this.editProfile = Object.assign({}, this.profile)
    }
  },
  methods: {
    updateProfile () {
      this.axios.put('/api/account/profile', this.editProfile).then(res => {
        this.$emit('update-profile', res.data)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.profile
  text-align center
</style>
