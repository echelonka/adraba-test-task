const state = {
  isLoggedIn: false
}

const mutations = {
  logIn () {
    state.isLoggedIn = true
  },
  logOut () {
    state.isLoggedIn = false
  }
}

export default {
  state,
  mutations
}
