<template>
  <div class="dark-background">
    <div class="uk-container uk-padding" v-if="$store.state.movies.favoriteMovies.list.length && $store.state.auth.isLoggedIn">
      <div class="uk-h2 uk-light">Favorite movies</div>
      <div class="uk-grid-medium uk-child-width-1-2@s uk-flex movie-list" uk-grid>
        <div v-for="(movie, index) in $store.state.movies.favoriteMovies.list" :key="movie.id + Math.random()">
          <MovieCard
            v-if="index < 2"
            :movieType="'favoriteMovies'"
            :movieId="movie.id"
            :rating="movie.vote_average"
            :title="movie.title"
            :poster="movie.poster_path"
            :description="movie.overview"
            :genresList="movie.genres" />
        </div>
      </div>
      <router-link to="/favorite" class="uk-button uk-button-default uk-button-primary uk-align-center" tag="button">View more...</router-link>
    </div>
    <div class="uk-container uk-padding">
      <div class="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap">
        <div class="uk-h2 uk-margin-remove-bottom uk-light">{{listName}} movies</div>
        <div class="uk-margin">
          <select @change="filterMovies" v-model="sortBy" class="uk-select uk-form-small uk-form-width-small dark-background">
            <option value="popularity.desc">Most popular</option>
            <option value="popularity.asc">Less popular</option>
            <option value="release_date.desc">The newest</option>
            <option value="release_date.asc">The oldest</option>
          </select>
        </div>
      </div>
      <div class="uk-grid-medium uk-child-width-1-2@s uk-flex movie-list" uk-grid>
        <div v-for="movie in popular" :key="movie.id">
          <MovieCard
            :movieType="'filteredMovies'"
            :movieId="movie.id"
            :rating="movie.vote_average"
            :title="movie.title"
            :poster="movie.poster_path"
            :description="movie.overview" />
        </div>
      </div>
      <button class="uk-button uk-button-default uk-button-primary uk-align-center" @click="loadMovies" v-if="moreMovies">Load more</button>
    </div>
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard'
export default {
  name: 'MovieList',
  components: { MovieCard },
  data () {
    return {
      sortBy: 'popularity.desc'
    }
  },
  computed: {
    popular () {
      return this.$store.state.movies.filteredMovies.list
    },
    moreMovies () {
      const movies = this.$store.state.movies.filteredMovies
      return movies.list.length !== movies.total_results
    },
    listName () {
      if (this.sortBy === 'popularity.desc') {
        return 'Most popular'
      } else if (this.sortBy === 'popularity.asc') {
        return 'Less popular'
      } else if (this.sortBy === 'release_date.desc') {
        return 'The newest'
      } else {
        return 'The oldest'
      }
    }
  },
  methods: {
    loadMovies () {
      const params = {
        page: this.$store.state.movies.filteredMovies.page,
        sort_by: this.sortBy
      }
      this.$store.dispatch('fetchMovies', params)
    },
    filterMovies () {
      this.$store.commit('unsetFilteredMovies')
      const params = {
        page: 1,
        sort_by: this.sortBy
      }
      this.$store.dispatch('fetchMovies', params)
    }
  },
  beforeCreate () {
    this.$store.commit('unsetFilteredMovies')
    const params = {
      page: 1,
      sort_by: 'popularity.desc'
    }
    this.$store.dispatch('fetchMovies', params)
  },
  destroyed () {
    this.$store.commit('unsetFilteredMovies')
  }
}
</script>

<style scoped lang="sass">
  .movie-list
    min-height: 100%
</style>
