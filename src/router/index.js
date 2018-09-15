import Vue from 'vue'
import Router from 'vue-router'
import MovieList from '@/components/MovieList'
import MovieDetails from '@/components/MovieDetails'
import GenreList from '@/components/GenreList'
import FavoriteMovies from '@/components/FavoriteMovies'
import Search from '@/components/Search'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MovieList',
      component: MovieList
    },
    {
      path: '/favorite',
      name: 'FavoriteMovies',
      component: FavoriteMovies
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      props: route => ({
        query: route.query.query,
        year: route.query.year,
        include_adult: route.query.include_adult
      })
    },
    {
      path: '/:id',
      name: 'MovieDetails',
      component: MovieDetails
    },
    {
      path: '/genre/:id',
      name: 'GenreList',
      component: GenreList
    }
  ]
})
