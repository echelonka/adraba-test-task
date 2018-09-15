<template>
    <div class="uk-margin uk-margin-remove-bottom uk-container movie">
      <div v-if="movie">
        <ul class="uk-breadcrumb" itemscope itemtype="http://schema.org/BreadcrumbList">
          <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
            <router-link to="/" itemtype="http://schema.org/Thing" itemprop="item">Home</router-link>
            <meta itemprop="position" content="1" />
          </li>
          <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
            <span itemprop="name">{{movie.title}}</span>
            <meta itemprop="position" content="2" />
          </li>
        </ul>
        <div>
          <div class="uk-background-cover uk-background-fixed uk-height-large uk-panel uk-flex uk-flex-center uk-flex-middle" :style="'background-image: url(https://image.tmdb.org/t/p/w1280' + movie.backdrop_path + ');'">
            <h1 class="movie__title uk-light">{{movie.title}}</h1>
          </div>
        </div>
        <hr class="uk-divider-icon">
        <h4 class="uk-light uk-text-center uk-text-capitalize uk-margin-remove">{{movie.tagline}}</h4>
        <article class="uk-article uk-margin uk-margin-remove-top uk-light uk-flex uk-flex-wrap">
          <div class="uk-width-1-3@s uk-padding-small uk-padding-remove-left uk-padding-remove-right uk-padding-remove-bottom">
            <img :src="'https://image.tmdb.org/t/p/w342' + movie.poster_path" :alt="movie.title">
          </div>
          <div class="uk-width-2-3@s uk-padding-small">
            <div class="uk-flex uk-flex-between">
              <div>{{runtime}}</div>
              <div class="movie-list__item-badge">
                <div @click="isAdded ? removeFromFavorites() : addToFavorites()"
                     :class="{'movie-list__item-favorite': true, 'movie-list__item-favorite--added': isAdded}"
                     uk-icon="icon: heart"
                     v-if="$store.state.auth.isLoggedIn"></div>
                <div class="movie-list__item-rating">{{movie.vote_average}}/10</div>
              </div>
            </div>
            <div class="movie-list__item-genres">
              <router-link :to="{name: 'GenreList', params: {id: genre.id}}" v-for="genre in genres" :key="genre.id + Math.random()" :style="{backgroundColor: genre.background}">
                {{genre.name}}
              </router-link>
            </div>
            <h3>Overview</h3>
            <p>{{movie.overview}}</p>
            <h3>Featured Crew</h3>
            <div v-if="this.$store.state.movies.movieDetails.credits.crew"><b>Directing:</b> {{directors}}</div>
            <div v-if="this.$store.state.movies.movieDetails.credits.crew && writing"><b>Writing:</b> {{writing}}</div>
            <h3>Cast</h3>
            <div v-if="this.$store.state.movies.movieDetails.credits.cast" v-html="stars"></div>
          </div>
        </article>
        <div class="uk-h2 uk-light" v-if="similarMovies.length">Similar movies</div>
        <div class="uk-grid-medium uk-child-width-1-2@s uk-flex" uk-grid>
          <div v-for="movie in similarMovies" :key="movie.id">
            <MovieCard
              :movieType="'similarMovies'"
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
  name: 'MovieDetails',
  components: {MovieCard},
  computed: {
    movie () {
      return this.$store.state.movies.movieDetails.info
    },
    similarMovies () {
      return this.$store.state.movies.similarMovies.list
    },
    runtime () {
      let num = this.$store.state.movies.movieDetails.info.runtime
      let hours = num / 60
      let rhours = Math.floor(hours)
      let minutes = (hours - rhours) * 60
      let rminutes = Math.round(minutes)
      return `${rhours}h ${rminutes}min`
    },
    directors () {
      let directors = this.$store.state.movies.movieDetails.credits.crew.filter(item => item.job === 'Director')
      directors = directors.map(director => director.name).join(', ')
      return directors
    },
    writing () {
      let writers = this.$store.state.movies.movieDetails.credits.crew.filter(item => item.job === 'Screenplay')
      writers = writers.map(writer => writer.name).join(', ')
      return writers
    },
    stars () {
      let stars = this.$store.state.movies.movieDetails.credits.cast.filter((item, i) => i < 5)
      stars = stars.map(star => star.character ? `<b>${star.name}</b> (${star.character})` : `<b>${star.name}</b>`).join(', ')
      return stars
    },
    moreMovies () {
      let movies = this.$store.state.movies.similarMovies
      return movies.list.length !== movies.total_results
    },
    genres () {
      let movieGenres = this.$store.state.movies.movieDetails.info.genres
      let genres = this.$store.state.movies.genres
      movieGenres.map(item => {
        item.background = genres.find(genre => genre.id === item.id).background
      })
      return movieGenres
    },
    isAdded () {
      return !!this.$store.state.movies.favoriteMovies.list.find(item => item.id === this.$store.state.movies.movieDetails.info.id)
    }
  },
  methods: {
    fetchInfo (id) {
      scrollTo(0, 0)
      this.$store.commit('unsetSimilarMovies')
      this.$store.commit('unsetMovie')
      this.$store.dispatch('getMovieDetails', id)
      this.$store.dispatch('getSimilarMovies', {id: id, params: {page: 1}})
      this.$store.dispatch('getCredits', this.$route.params.id)
    },
    loadMovies () {
      let params = {
        id: this.$route.params.id,
        params: {page: this.$store.state.movies.similarMovies.page}
      }
      this.$store.dispatch('getSimilarMovies', params)
    },
    addToFavorites () {
      this.$store.commit('addToFavorites', this.$store.state.movies.movieDetails.info.id)
    },
    removeFromFavorites () {
      this.$store.commit('removeFromFavorites', this.$store.state.movies.movieDetails.info.id)
    }
  },
  watch: {
    // Update info while navigating between movies
    '$route.params.id' (id) {
      this.fetchInfo(id)
    }
  },
  beforeCreate () {
    scrollTo(0, 0)
    this.$store.dispatch('getMovieDetails', this.$route.params.id)
    this.$store.dispatch('getSimilarMovies', {id: this.$route.params.id, params: {page: 1}})
    this.$store.dispatch('getCredits', this.$route.params.id)
  },
  /* Remove movies from store */
  destroyed () {
    this.$store.commit('unsetSimilarMovies')
    this.$store.commit('unsetMovie')
  }
}
</script>

<style scoped lang="sass">

</style>
