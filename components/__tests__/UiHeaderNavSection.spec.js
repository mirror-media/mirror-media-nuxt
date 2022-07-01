describe('empty test', () => {
  test('', () => {})
})

// import UiHeaderNavSection from '../UiHeaderNavSection.vue'

// import createWrapperHelper from '~/test/helpers/createWrapperHelper'

/*
 * const categoryMock = { name: 'bookreview', title: '書評' }
 * const sectionMock = {
 *   name: 'culture',
 *   title: '文化',
 *   isFeatured: true,
 *   categories: [categoryMock],
 * }
 * const partnerMock = {
 *   name: 'healthnews',
 *   display: '健康醫療網新聞',
 *   public: true,
 * }
 * const mockFeatureToggle = {
 *   headerExternalsFeatureToggle: 'on',
 * }
 */

/*
 * const createWrapper = createWrapperHelper({
 *   propsData: {
 *     sections: [sectionMock],
 *     partners: [partnerMock],
 *     $config: { ...mockFeatureToggle },
 *   },
 * })
 */

/*
 * describe('normal navbar items', () => {
 *   test('display section navbar items', () => {
 *     const sut = createWrapper(UiHeaderNavSection, {
 *       propsData: {
 *         $config: mockFeatureToggle,
 *       },
 *     })
 */

/*
 *     expect(sut.get(`[href="/section/${sectionMock.name}"]`).text()).toBe(
 *       sectionMock.title
 *     )
 *   })
 */

/*
 *   test('display category items in the drop-down list', () => {
 *     const sut = createWrapper(UiHeaderNavSection)
 */

/*
 *     expect(sut.get(`[href="/category/${categoryMock.name}"]`).text()).toBe(
 *       categoryMock.title
 *     )
 *   })
 */

/*
 *   test('hightlight the section navbar item when users on the specific page', () => {
 *     const sut = createWrapper(UiHeaderNavSection, {
 *       propsData: {
 *         currentSectionName: sectionMock.name,
 *       },
 *     })
 */

/*
 *     expect(sut.get(`.section--${sectionMock.name}`).classes('active')).toBe(
 *       true
 *     )
 *   })
 * })
 */

// /*
//  * describe('external navbar item', () => {
//  *   test('display partner items in the drop-down list', () => {
//  *     const sut = createWrapper(UiHeaderNavSection)
//  *
//  *     expect(sut.get(`[href="/externals/${partnerMock.name}"]`).text()).toBe(
//  *       partnerMock.display
//  *     )
//  *   })
//  * })
//  */

// describe('GA events', () => {
//   test('send a GA event when users click a section navbar item', () => {
//     /* Arrange */
//     const sut = createWrapper(UiHeaderNavSection)

//     /* Act */
//     sut.get(`[href="/section/${sectionMock.name}"]`).trigger('click')
//     sut.get(`[href="/"]`).trigger('click')

//     /* Assert */
//     expect(sut.emitted().sendGa[0]).toEqual([
//       {
//         eventCategory: 'header',
//         eventAction: 'click',
//         eventLabel: `section ${sectionMock.name}`,
//       },
//     ])
//     expect(sut.emitted().sendGa[1]).toEqual([
//       {
//         eventCategory: 'header',
//         eventAction: 'click',
//         eventLabel: 'section home',
//       },
//     ])
//   })

/*
 *   test('send a GA event when users click a category item in the drop-down list', () => {
 *     const sut = createWrapper(UiHeaderNavSection)
 */

//     sut.get(`[href="/category/${categoryMock.name}"]`).trigger('click')

/*
 *     expect(sut.emitted().sendGa[0]).toEqual([
 *       {
 *         eventCategory: 'header',
 *         eventAction: 'click',
 *         eventLabel: `category ${categoryMock.name}`,
 *       },
 *     ])
 *   })
 */

//   /*
//    * test('send a GA event when users click a partner item in the drop-down list', () => {
//    *   const sut = createWrapper(UiHeaderNavSection)
//    *
//    *   sut.get(`[href="/externals/${partnerMock.name}"]`).trigger('click')
//    *
//    *   expect(sut.emitted().sendGa[0]).toEqual([
//    *     {
//    *       eventCategory: 'header',
//    *       eventAction: 'click',
//    *       eventLabel: `external ${partnerMock.name}`,
//    *     },
//    *   ])
//    * )
//    */
// })
