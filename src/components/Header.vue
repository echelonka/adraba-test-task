<template>
  <div class="dark-background">
    <div class="uk-container uk-container-large">
      <nav class="uk-navbar-container uk-navbar-transparent" uk-navbar>
        <div class="uk-navbar-left">
          <router-link to="/" class="uk-navbar-item uk-logo">Adraba Movies</router-link>
          <ul class="uk-navbar-nav" v-if="isLoggedIn">
            <li>
              <router-link to="/favorite">
                <span class="uk-icon uk-margin-small-right" uk-icon="icon: heart"></span>
                Favorite Movies
              </router-link>
            </li>
          </ul>
        </div>
        <div class="uk-navbar-right">
          <div>
            <a class="uk-navbar-toggle" href="#" uk-search-icon></a>
            <div class="uk-navbar-dropdown" uk-drop="mode: click; cls-drop: uk-navbar-dropdown; boundary: !nav">

              <div class="uk-grid-small uk-flex-middle" uk-grid>
                <div class="uk-width-expand">
                  <form class="uk-search uk-search-navbar uk-width-1-1" @submit="searchMovies">
                    <input v-model="search" class="uk-search-input" type="search" placeholder="Search..." autofocus>
                  </form>
                </div>
                <div class="uk-width-auto">
                  <a class="uk-navbar-dropdown-close" href="#" uk-close></a>
                </div>
              </div>

            </div>
          </div>
          <div class="uk-navbar-item">
            <div @click="isLoggedIn ? logOut() : null" :uk-toggle="isLoggedIn ? null : 'target: #login-modal'">
              <a class="uk-link-reset" href="#">
                <span class="uk-icon uk-margin-small-right" uk-icon="icon: user"></span>
                {{isLoggedIn ? 'Log Out' : 'Log In'}}
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div id="login-modal" class="uk-flex-top" uk-modal>
        <div class="uk-modal-dialog uk-margin-auto-vertical uk-background-secondary ">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div class="uk-modal-header uk-background-secondary">
            <h2 class="uk-modal-title uk-light">Log In</h2>
          </div>
          <form @submit="checkForm">
            <div class="uk-modal-body uk-margin-auto-vertical">
              <div class="uk-margin uk-flex uk-flex-center">
                <div class="uk-inline">
                  <span class="uk-form-icon uk-form-icon-flip" uk-icon="icon: user"></span>
                  <input v-model="username" class="uk-input uk-form-width-large" placeholder="Username" type="text">
                </div>
              </div>
              <div class="uk-margin uk-flex uk-flex-center">
                <div class="uk-inline">
                  <span class="uk-form-icon uk-form-icon-flip" uk-icon="icon: lock"></span>
                  <input v-model="password" class="uk-input uk-form-width-large" placeholder="Password" type="password">
                </div>
              </div>
            </div>
            <div class="uk-modal-footer uk-background-secondary">
              <button type="submit" class="uk-button uk-button-default uk-button-primary uk-align-center">Log In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UIkit from 'uikit'
export default {
  name: 'Header',
  data () {
    return {
      username: '',
      password: '',
      search: ''
    }
  },
  computed: {
    isLoggedIn () {
      return this.$store.state.auth.isLoggedIn
    }
  },
  methods: {
    logIn () {
      this.username = ''
      this.password = ''
      this.$store.commit('logIn')
      UIkit.modal('#login-modal').hide()
      this.$cookies.set('isLoggedIn', 'true', '1d')
    },
    logOut () {
      this.$store.commit('logOut')
      this.$cookies.remove('isLoggedIn')
    },
    checkForm (e) {
      e.preventDefault()
      UIkit.notification.closeAll()
      /* Very simple authorization :) */
      if (!this.username || !this.password) {
        return UIkit.notification({ message: 'Please, type your username and password', status: 'danger' })
      }
      if (this.username !== 'admin' || this.password !== '123456') {
        return UIkit.notification({ message: 'Wrong username or password', status: 'danger' })
      }
      UIkit.notification({ message: 'Successfully logged in!', status: 'success' })
      return this.logIn()
    },
    searchMovies (e) {
      e.preventDefault()
      this.$router.push({ name: 'Search', query: { query: this.search } })
    }
  }
}
</script>

<style scoped lang="sass">
  @import "../assets/sass/variables"

  .uk-container
    border-bottom: 1px solid rgba($mediumSeaGreen, .5)
  .uk-modal-header
    border-bottom: none
  .uk-modal-footer
    border-top: none
</style>
