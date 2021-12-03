/*
 * This is the entry point of experiments use by plugins/google-optimize-experiments plugin
 * file and data structure inspired by https://github.com/nuxt-community/google-optimize-module
 */

import normalPostRelatedRedesign from './normal-post-related-redesign'
import homepageLatestRedesign from './homepage-latest-redesign'
import normalPostPapularRedesign from './normal-post-popular-redesign'

export default [normalPostRelatedRedesign, normalPostPapularRedesign, homepageLatestRedesign]
