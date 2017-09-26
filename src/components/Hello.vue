<template>
  <div class="hello">

    <h5>GoBase Demo Application</h5>
    <hr>
    <div>
      <p>This demo application is using Json Web Tokens (JWT) for authentication in combination with a passwordless authentication flow.</p>
      <p>You need to be logged in to see admin and account features. With admin account you can also register new accounts with other email addresses.</p>
      <p>To login click on top right corner icon and use one of below email addresses provided by Maildrop.cc disposable email service.</p>
      <p>The Login Token will be sent to this temporary inbox. You need to copy/paste the token as the link will not work from within Maildrop.cc</p>
    </div>
    <div class="row justify-center">
      <table class="q-table horizontal-separator">
        <thead>
          <tr>
            <th class="text-left">Email</th>
            <th class="text-right">Maildrop.cc</th>
          </tr>

        </thead>
        <tbody>
          <tr>
            <td class="text-left">gobase-admin@maildrop.cc</td>
            <td class="text-right"><a href="https://maildrop.cc/inbox/gobase-admin" target="_blank">Check Inbox <q-icon name="open_in_new"/></a></td>
          </tr>
          <tr>
            <td class="text-left">gobase-user@maildrop.cc</td>
            <td class="text-right"><a href="https://maildrop.cc/inbox/gobase-user" target="_blank">Check Inbox <q-icon name="open_in_new"/></a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bottom">
      <hr>
      <h6>Build with Quasar PWA</h6>
      <ul>
        <li><a href="http://quasar-framework.org" target="_blank" rel="noopener">Docs</a></li>
        <li><a href="http://forum.quasar-framework.org" target="_blank" rel="noopener">Forum</a></li>
        <li><a href="https://gitter.im/quasarframework/Lobby" target="_blank" rel="noopener">Gitter Chat</a></li>
        <li><a href="https://twitter.com/quasarframework" target="_blank" rel="noopener">Twitter</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import {QIcon} from 'quasar'
export default {
  components: {QIcon},
  name: 'hello'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~variables'

.hello
  text-align center
  a
    color #35495E
.bottom
  margin-top 50px

ul
  list-style-type none
  padding 0

li
  display inline-block
  margin 0 10px
</style>
