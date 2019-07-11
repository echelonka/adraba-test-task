import FavoriteMovies from '@/components/FavoriteMovies'

describe('FavoriteMovies.vue', () => {
  it('has a created hook', () => {
    expect(typeof FavoriteMovies.beforeCreate).toBe('function')
  })
})
