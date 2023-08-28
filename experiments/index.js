/*
 * This is the entry point of experiments use by plugins/google-optimize-experiments plugin
 * file and data structure inspired by https://github.com/nuxt-community/google-optimize-module
 */

import normalPostRelatedRedesign from './normal-post-related-redesign'
import homepageLatestRedesign from './homepage-latest-redesign'
import premiumListRelatedRedesign from './premium-list-related-redesign'
import premiumPostRelatedPosition from './premium-post-related-position'
import homepageEditorChoicesRedesigned from './homepage-editor-choices-redesigned'

export default [
  normalPostRelatedRedesign,
  homepageLatestRedesign,
  premiumListRelatedRedesign,
  premiumPostRelatedPosition,
  homepageEditorChoicesRedesigned,
]
