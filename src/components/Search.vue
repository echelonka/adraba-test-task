<template>
    <div class="dark-background">
      <div class="uk-container uk-padding">
        <div class="uk-h2 uk-light">Search movies</div>
        <div class="uk-grid-medium uk-child-width-1-2@s uk-flex movie-list" uk-grid>
          <div v-for="movie in searched" :key="movie.id">
            <MovieCard
              :movieType="'searchedMovies'"
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
  name: 'Search',
  components: {MovieCard},
  props: [
    'query',
    'year',
    'include_adult'
  ],
  computed: {
    searched () {
      return this.$store.state.movies.searchedMovies.list
    },
    moreMovies () {
      let movies = this.$store.state.movies.searchedMovies
      return movies.list.length !== movies.total_results
    }
  },
  methods: {
    fetchInfo () {
      scrollTo(0, 0)
      this.$store.commit('unsetSearchedMovies')
      this.$store.dispatch('searchMovies', this.$route.query)
    },
    loadMovies () {
      let params = {
        page: this.$store.state.movies.searchedMovies.page,
        query: this.$route.query.query
      }
      this.$store.dispatch('searchMovies', params)
    }
  },
  watch: {
    // Update info while searching from the route
    '$route.query.query' () {
      this.fetchInfo()
    }
  },
  beforeCreate () {
    let params = this.$route.query
    if (!Object.keys(params).length && !params.query) {
      return this.$router.push({name: 'MovieList'})
    }
    this.$store.dispatch('searchMovies', params)
  },
  /* Remove movies from store */
  destroyed () {
    this.$store.commit('unsetSearchedMovies')
  }
}
</script>

<style scoped>

</style>
