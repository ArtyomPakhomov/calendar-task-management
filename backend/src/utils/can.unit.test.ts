import { canEditTask, hasPermission } from './can'

describe('can', () => {
  it('hasPermission return true for user with this permission', () => {
    expect(hasPermission({ permissions: ['BLOCK_TASKS'], id: 'x' }, 'BLOCK_TASKS')).toBe(true)
  })

  it('hasPermission return false for user without this permission', () => {
    expect(hasPermission({ permissions: [], id: 'x' }, 'BLOCK_TASKS')).toBe(false)
  })

  it('hasPermission return true for user with "ALL" permission', () => {
    expect(hasPermission({ permissions: ['ALL'], id: 'x' }, 'BLOCK_TASKS')).toBe(true)
  })

  it('only author can edit his task', () => {
    expect(canEditTask({ permissions: [], id: 'x' }, { authorId: 'x' })).toBe(true)
    expect(canEditTask({ permissions: [], id: 'hacker' }, { authorId: 'x' })).toBe(false)
  })
})
