import { getters } from '../sections'

test('return section by category name', () => {
  const state = {}
  const sections = [
    {
      categories: [{ name: 'business' }, { name: 'money' }],
    },
    {
      categories: [{ name: 'somebody' }, { name: 'world' }],
    },
  ]

  expect(
    getters.getSectionByCategoryName(state, { sections })('somebody')
  ).toEqual(sections[1])
  expect(
    getters.getSectionByCategoryName(state, { sections })('political')
  ).toEqual({})
})
