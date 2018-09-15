import Vue from 'vue'
import FavoriteMovies from '@/components/FavoriteMovies'

describe('FavoriteMovies.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(FavoriteMovies)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.uk-h2.uk-light').textContent)
      .toEqual('Favorite movies')
  })
})
