<template>
    <div class="uk-container uk-padding">
      <div class="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap">
        <div class="uk-h2 uk-margin-remove-bottom uk-light">{{genre}} movies</div>
        <div class="uk-margin">
          <select @change="filterMovies" v-model="sortBy" class="uk-select uk-form-small uk-form-width-small dark-background">
            <option value="popularity.desc">Most popular</option>
            <option value="popularity.asc">Less popular</option>
            <option value="release_date.desc">The newest</option>
            <option value="release_date.asc">The oldest</option>
          </select>
        </div>
      </div>
      <ul class="uk-breadcrumb uk-margin-remove-top" itemscope itemtype="http://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
          <router-link to="/" itemtype="http://schema.org/Thing" itemprop="item">Home</router-link>
          <meta itemprop="position" content="1" />
        </li>
        <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
          <span itemprop="name">{{genre}} movies</span>
          <meta itemprop="position" content="2" />
        </li>
      </ul>
      <div class="uk-grid-medium uk-child-width-1-2@s uk-flex movie-list" uk-grid>
        <div v-for="movie in filteredMovies" :key="movie.id">
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
</template>

<script>
import MovieCard from '@/components/MovieCard'
export default {
  name: 'GenreList',
  components: { MovieCard },
  data () {
    return {
      sortBy: 'popularity.desc'
    }
  },
  computed: {
    // eslint-disable-next-line
    genre () {
      if (this.$store.state.movies.genres.length) {
        return this.$store.state.movies.genres.find(genre => genre.id === +this.$route.params.id).name
      }
    },
    filteredMovies () {
      return this.$store.state.movies.filteredMovies.list
    },
    moreMovies () {
      const movies = this.$store.state.movies.filteredMovies
      return movies.list.length !== movies.total_results
    }
  },
  methods: {
    fetchInfo (id) {
      scrollTo(0, 0)
      this.$store.commit('unsetFilteredMovies')
      this.$store.dispatch('fetchMovies', { with_genres: id, page: 1 })
    },
    loadMovies () {
      const params = {
        with_genres: this.$route.params.id,
        page: this.$store.state.movies.filteredMovies.page,
        sort_by: this.sortBy
      }
      this.$store.dispatch('fetchMovies', params)
    },
    filterMovies () {
      this.$store.commit('unsetFilteredMovies')
      const params = {
        page: 1,
        with_genres: this.$route.params.id,
        sort_by: this.sortBy
      }
      this.$store.dispatch('fetchMovies', params)
    }
  },
  watch: {
    // Update info while navigating between movies
    '$route.params.id': function (id) {
      this.fetchInfo(id)
    }
  },
  beforeCreate () {
    scrollTo(0, 0)
    const params = {
      with_genres: this.$route.params.id,
      page: 1
    }
    this.$store.dispatch('fetchMovies', params)
  },
  /* Remove movies from store */
  destroyed () {
    this.$store.commit('unsetFilteredMovies')
  }
}
</script>

<style scoped lang="sass">

</style>
