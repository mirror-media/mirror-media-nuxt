/*
 * This is the entry point of experiments use by plugins/google-optimize-experiments plugin
 * file and data structure inspired by https://github.com/nuxt-community/google-optimize-module
 */

import normalPostRelatedRedesign from './normal-post-related-redesign'
import homepageLatestRedesign from './homepage-latest-redesign'
import homepageEditorChoiceMobileRedesign from './homepage-editor-choice-mobile-redesign'
import premiumListRelatedRedesign from './premium-list-related-redesign'

export default [
  normalPostRelatedRedesign,
  homepageLatestRedesign,
  homepageEditorChoiceMobileRedesign,
  premiumListRelatedRedesign,
]
