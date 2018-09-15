<template>
  <div id="app">
    <Header />
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'App',
  components: {Header},
  beforeCreate () {
    /* Fetch genres if they are not in store */
    if (!this.$store.state.movies.genres.length) {
      this.$store.dispatch('getGenres')
    }
    /* Automatically log in if cookie exists */
    if (this.$cookies.isKey('isLoggedIn')) {
      this.$store.commit('logIn')
    }
    /* Save favorite movies from local storage to store if they exist */
    if (localStorage.getItem('favorite')) {
      this.$store.commit('setFavoriteToStore')
    }
  }
}
</script>

<style lang="sass">
</style>
