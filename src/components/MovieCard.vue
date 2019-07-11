<template>
  <transition name="fade">
    <div class="uk-card uk-card-hover uk-card-secondary uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>
      <router-link :to="{name: 'MovieDetails', params: {id: movieId}}" class="uk-card-media-left uk-cover-container" tag="div">
        <img :src="'https://image.tmdb.org/t/p/w342' + poster" alt="" uk-cover>
        <canvas width="600" height="400"></canvas>
      </router-link>
      <div>
        <div class="uk-card-body uk-padding-small">
          <div class="movie-list__item-badge">
            <div :class="{'movie-list__item-favorite': true, 'movie-list__item-favorite--added': isAdded}"
                 uk-icon="icon: heart"
                 @click="isAdded ? removeFromFavorites() : addToFavorites()"
                 v-if="$store.state.auth.isLoggedIn"></div>
            <div class="movie-list__item-rating">{{rating}}/10</div>
          </div>
          <router-link :to="{name: 'MovieDetails', params: {id: movieId}}" class="uk-link-heading uk-card-title uk-text-large">{{title}}</router-link>
          <div class="movie-list__item-genres">
            <router-link :to="{name: 'GenreList', params: {id: genre.id}}" v-for="genre in genres" :key="genre.id + Math.random()" :style="{backgroundColor: genre.background}">
              {{genre.name}}
            </router-link>
          </div>
          <p class="uk-text-small">{{cutDescription}}</p>
        </div>
        <div class="uk-card-footer uk-position-bottom-right">
          <router-link :to="{name: 'MovieDetails', params: {id: movieId}}" class="uk-button uk-button-text">More info</router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MovieCard',
  props: [
    'movieType',
    'movieId',
    'poster',
    'rating',
    'title',
    'description',
    'genresList'
  ],
  computed: {
    cutDescription () {
      return this.description.split(' ').splice(0, 41).join(' ') + '...'
    },
    // eslint-disable-next-line
    genres () {
      const movies = this.$store.state.movies[this.movieType].list
      const genres = this.$store.state.movies.genres
      if (movies.length && genres.length) {
        if (!this.genresList) {
          const id = movies.find(movie => movie.id === this.movieId).genre_ids
          return id.map(item => genres.find(genre => genre.id === item))
        } else {
          const list = this.genresList
          list.map(item => {
            item.background = genres.find(genre => genre.id === item.id).background
          })
          return list
        }
      }
    },
    isAdded () {
      return !!this.$store.state.movies.favoriteMovies.list.find(item => item.id === this.movieId)
    }
  },
  methods: {
    addToFavorites () {
      this.$store.commit('addToFavorites', this.movieId)
    },
    removeFromFavorites () {
      this.$store.commit('removeFromFavorites', this.movieId)
    }
  }
}
</script>

<style scoped lang="sass">
  .uk-card-media-left
    cursor: pointer
  .uk-card
    min-height: 415px
    height: 100%
    &-body
      padding-bottom: 60px
</style>
