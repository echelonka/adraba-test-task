<template>
  <div class="dark-background">
    <div class="uk-container uk-padding">
      <ul class="uk-breadcrumb" itemscope itemtype="http://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
          <router-link to="/" itemtype="http://schema.org/Thing" itemprop="item">Home</router-link>
          <meta itemprop="position" content="1"/>
        </li>
        <li itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
          <span itemprop="name">Favorite movies</span>
          <meta itemprop="position" content="2"/>
        </li>
      </ul>
      <div class="uk-h2 uk-light">Favorite movies</div>
      <transition name="fade">
        <div v-if="!movies.length" class="uk-placeholder uk-light uk-text-center">Your list of favorite movies is
          empty.
        </div>
      </transition>
      <div class="uk-grid-medium uk-child-width-1-2@s uk-flex" uk-grid>
        <div v-for="movie in movies" :key="movie.id">
          <MovieCard
            :movieType="'favoriteMovies'"
            :movieId="movie.id"
            :rating="movie.vote_average"
            :title="movie.title"
            :poster="movie.poster_path"
            :description="movie.overview"
            :genresList="movie.genres"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard'

export default {
  name: 'FavoriteMovies',
  components: { MovieCard },
  computed: {
    movies () {
      return this.$store.state.movies.favoriteMovies.list
    }
  },
  beforeCreate () {
    if (!this.$store.state.auth.isLoggedIn) {
      this.$router.push({ name: 'MovieList' })
    }
  }
}
</script>

<style scoped>

</style>
