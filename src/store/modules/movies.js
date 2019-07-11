import Vue from 'vue'

const apiKey = '&api_key=696e4b4e4e4f47c11412675cbd4c917b'
const apiURL = 'https://api.themoviedb.org/3'
const toQuery = obj => {
  return Object.keys(obj).reduce((a, k) => {
    a.push(`${k}=${encodeURIComponent(obj[k])}`)
    return a
  }, []).join('&')
}

const state = {
  similarMovies: { list: [], page: 1, total_results: 0 },
  filteredMovies: { list: [], page: 1, total_results: 0 },
  searchedMovies: { list: [], page: 1, total_results: 0 },
  movieDetails: { info: null, credits: [] },
  genres: [],
  favoriteMovies: { list: [] }
}

const actions = {
  /**
   * @description Fetch movies according to given parameters
   * @param dispatch
   * @param commit
   * @param params Parameters object
   */
  fetchMovies ({ commit }, params) {
    Vue.http.get(`${apiURL}/discover/movie?${toQuery(params)}${apiKey}`)
      .then(response => response.json())
      .then(response => {
        commit('setFilteredMovies', response)
      }) // TODO show error
  },
  /**
   * @description Get movie details
   * @param commit
   * @param id Movie ID
   */
  getMovieDetails ({ commit }, id) {
    Vue.http.get(`${apiURL}/movie/${id}?${apiKey}`)
      .then(response => response.json())
      .then(response => {
        commit('setMovie', response)
      }) // TODO show error
  },
  /**
   * @description Get similar movies
   * @param commit
   * @param id Movie ID
   * @param params Parameters object
   */
  getSimilarMovies ({ commit }, { id, params }) {
    Vue.http.get(`${apiURL}/movie/${id}/similar?${toQuery(params)}${apiKey}`)
      .then(response => response.json())
      .then(response => {
        commit('setSimilarMovies', response)
      }) // TODO show error
  },
  getCredits ({ commit }, id) {
    Vue.http.get(`${apiURL}/movie/${id}/credits?${apiKey}`)
      .then(response => response.json())
      .then(response => {
        commit('setCredits', response)
      }) // TODO show error
  },
  /**
   * @description Get existing movie genres
   * @param commit
   */
  getGenres ({ commit }) {
    const colors = [
      'darkorange', '#1db954', '#1e87f0', '#ee395b', '#4A148C', '#004D40', '#1A237E', '#01579B', '#4E342E', '#424242',
      '#827717', '#880E4F', '#303F9F', '#E65100', '#000000', '#651FFF', '#00BFA5', '#9E9D24', '#43A047'
    ]
    Vue.http.get(`${apiURL}/genre/movie/list?${apiKey}`)
      .then(response => response.json())
      .then(response => {
        /* Set unique background color for each genre */
        response.genres.map((genre, i) => {
          genre.background = colors[i]
        })
        commit('setGenres', response)
      }) // TODO show error
  },
  /**
   * Search movies by given parameters
   * @param commit
   * @param params
   */
  searchMovies ({ commit }, params) {
    Vue.http.get(`${apiURL}/search/movie?${toQuery(params)}${apiKey}`)
      .then(response => response.json())
      .then(response => {
        commit('setSearchedMovies', response)
      })
  }
}

const mutations = {
  /**
   * Single movie
   * @param state
   * @param movie
   */
  setMovie (state, movie) {
    state.movieDetails.info = movie
  },
  unsetMovie (state) {
    state.movieDetails.info = null
  },
  /**
   * Similar movies
   * @param state
   * @param similarMovies
   */
  setSimilarMovies (state, similarMovies) {
    state.similarMovies.list = state.similarMovies.list.concat(similarMovies.results)
    state.similarMovies.page += 1
    state.similarMovies.total_results = similarMovies.total_results
  },
  unsetSimilarMovies (state) {
    state.similarMovies.list = []
    state.similarMovies.page = 1
  },
  setCredits (state, credits) {
    state.movieDetails.credits = credits
  },
  setGenres (state, genres) {
    state.genres = genres.genres
  },
  /**
   * Filtered movies
   * @param state
   * @param movies
   */
  setFilteredMovies (state, movies) {
    state.filteredMovies.list = state.filteredMovies.list.concat(movies.results)
    state.filteredMovies.page += 1
    state.filteredMovies.total_results = movies.total_results
  },
  unsetFilteredMovies (state) {
    state.filteredMovies.list = []
    state.filteredMovies.page = 1
    state.filteredMovies.total_results = 0
  },
  /**
   * Favorite movies
   * @param state
   */
  setFavoriteToStore (state) {
    state.favoriteMovies.list = JSON.parse(localStorage.getItem('favorite'))
  },
  addToFavorites (state, id) {
    Vue.http.get(`${apiURL}/movie/${id}?${apiKey}`)
      .then(response => response.json())
      .then(response => {
        state.favoriteMovies.list.push(response)
        localStorage.setItem('favorite', JSON.stringify(state.favoriteMovies.list))
      })
  },
  removeFromFavorites (state, id) {
    state.favoriteMovies.list = state.favoriteMovies.list.filter(movie => movie.id !== id)
    localStorage.setItem('favorite', JSON.stringify(state.favoriteMovies.list))
  },
  /**
   * Searched movies
   * @param state
   * @param movies
   */
  setSearchedMovies (state, movies) {
    state.searchedMovies.list = state.searchedMovies.list.concat(movies.results)
    state.searchedMovies.page += 1
    state.searchedMovies.total_results = movies.total_results
  },
  unsetSearchedMovies (state) {
    state.searchedMovies.list = []
    state.searchedMovies.page = 1
    state.searchedMovies.total_results = 0
  }
}

export default {
  state,
  actions,
  mutations
}
