<template>
  <vue-dfp-provider
    :dfpUnits="dfpUnits"
    :dfpid="dfpid"
    :section="`other`"
    :options="dfpOptions"
    :mode="dfpMode"
  >
    <template slot="dfpPos" slot-scope="props">
      <div
        :class="[{ 'topic-view': !isTimeline }, topicType]"
        :style="needWineWarning ? { paddingBottom: '10px' } : ''"
      >
        <!--   專題樣式：Wide  -->
        <template v-if="pageStyle === 'wide'">
          <leading-watch :topic="topic" :type="`TOPIC`" />
          <article-list-full :articles="articles" />
          <more-full v-if="hasMore && !loading" @loadMore="loadMore" />
          <loading :show="loading" />
          <share :right="`20px`" :bottom="`20px`" />
        </template>

        <!--    各式型態    -->
        <template v-else-if="topicType === 'timeline'">
          <a href="/" class="topicTimeline__logo">
            <img
              src="/deprecated/topic-page/assets/mirrormedia/icon/logo@2x.png"
              :alt="siteTitle"
            />
          </a>
          <share
            :direction="`right`"
            :top="`5px`"
            :left="`55px`"
            :color="`#000`"
          />
          <timeline-headline :initialTimeline="timeline" />
          <timeline-body
            :initialTimeline="timeline"
            :initialHighlightNodes="highlightNodes"
            :viewport="viewport"
          />
          <div class="topicTimeline__projects">
            <h1>更多專題文章</h1>
            <!--            <ProjectSliderContainer :projects="filteredProjects" />-->
          </div>
        </template>

        <template v-else-if="topicType === 'portraitWall'">
          <div class="topic">
            <div class="topic-title">
              <h1 />
            </div>
            <leading
              v-if="getValue(topic, ['leading'])"
              :type="getValue(topic, ['leading'])"
              :mediaData="portraitWallSlideImages"
            />
          </div>
          <portraitWall-list
            :articles="articles"
            :initialMediaData="portraitWallListImages"
          />
          <div v-if="hasDFP" class="ad" style="padding: 20px 0">
            <vue-dfp
              :is="props.vueDfp"
              :pos="dfpPos"
              :dfpUnits="props.dfpUnits"
              :section="props.section"
              :dfpId="props.dfpId"
              :unitId="mobileDfp"
              :size="getValue($store, 'getters.deprecatedStore.adSize')"
            />
          </div>
          <share :right="`20px`" :bottom="`20px`" />
        </template>

        <template v-else-if="topicType === 'group'">
          <div class="topic">
            <div class="topic-title">
              <h1 />
            </div>
            <leading
              v-if="getValue(topic, ['leading'])"
              :type="getValue(topic, ['leading'])"
              :mediaData="mediaData"
            />
          </div>
          <group-list :articles="articles" :tags="tags" :viewport="viewport" />
          <div v-if="hasDFP" class="ad" style="padding: 20px 0">
            <vue-dfp
              :is="props.vueDfp"
              :pos="dfpPos"
              :dfpUnits="props.dfpUnits"
              :section="props.section"
              :dfpId="props.dfpId"
              :unitId="mobileDfp"
              :size="getValue($store, 'getters.deprecatedStore.adSize')"
            />
          </div>
        </template>
        <ListBody
          v-else-if="shouldRenderRedesignTopicList"
          :mediaData="mediaData"
          :isPresidentElectionId="isPresidentElectionId"
          :candidateData="candidateData"
          :loading="loading"
          :leadingType="getValue(topic, ['leading'])"
          :shouldLoadMore="shouldLoadMoreIsFeaturedArticles"
          @loadMorePresident="loadMorePresident"
          @loadMoreIsFeaturedArticles="loadMoreIsFeaturedArticles()"
        >
          <template v-slot:articleListIsFeatured>
            <article-list
              v-if="!isPresidentElectionId"
              id="articleList"
              ref="articleList"
              :articles="articlesIsFeatured"
              :hasDFP="false"
            />
          </template>
          <template v-slot:articlesIsNotFeatured>
            <article-list
              v-if="!isPresidentElectionId"
              id="articleListIsNotFeatured"
              ref="articleListIsNotFeatured"
              :articles="articlesIsNotFeatured"
              :hasDFP="false"
            />
          </template>
          <template v-slot:vueDfp
            ><div v-if="hasDFP" class="ad">
              <vue-dfp
                :is="props.vueDfp"
                :pos="dfpPos"
                :dfpUnits="props.dfpUnits"
                :section="props.section"
                :dfpId="props.dfpId"
                :unitId="mobileDfp"
                :size="getValue($store, 'getters.deprecatedStore.adSize')"
              /></div
          ></template>
        </ListBody>

        <template v-else>
          <div class="topic">
            <div class="topic-title">
              <h1 />
            </div>
            <leading
              v-if="getValue(topic, ['leading'])"
              :type="getValue(topic, ['leading'])"
              :mediaData="mediaData"
            />
          </div>

          <PresidentElectionProgress v-if="isPresidentElectionId" />
          <PresidentElectionList
            v-if="isPresidentElectionId"
            :candidateData="candidateData"
            @loadMore="loadMorePresident"
          />

          <article-list
            v-if="!isPresidentElectionId"
            id="articleList"
            ref="articleList"
            :articles="autoScrollArticles"
            :hasDFP="false"
          />
          <div v-if="hasDFP" class="ad">
            <vue-dfp
              :is="props.vueDfp"
              :pos="dfpPos"
              :dfpUnits="props.dfpUnits"
              :section="props.section"
              :dfpId="props.dfpId"
              :unitId="mobileDfp"
              :size="getValue($store, 'getters.deprecatedStore.adSize')"
            />
          </div>
          <article-list
            v-if="!isPresidentElectionId"
            v-show="hasAutoScroll"
            id="articleListAutoScroll"
            ref="articleListAutoScroll"
            :articles="autoScrollArticlesLoadMore"
            :hasDFP="false"
          />
          <loading :show="loading" />
          <share :right="`20px`" :bottom="`20px`" />
        </template>

        <WineWarning v-if="needWineWarning" />
      </div>
    </template>
  </vue-dfp-provider>
</template>

<script>
import _ from 'lodash'
import Cookie from 'vue-cookie'
import VueDfpProvider from 'plate-vue-dfp/DfpProvider.vue'
import { currentYPosition, elmYPosition } from '../kc-scroll'
import { adtracker } from './util/adtracking'
import {
  currEnv,
  getTruncatedVal,
  getValue,
  unLockJS,
  getBrief,
} from './util/comm'
import { getRole } from './util/mmABRoleAssign'

import {
  DFP_ID,
  DFP_UNITS,
  DFP_OPTIONS,
  DFP_SIZE_MAPPING,
  TAG,
  TOPIC,
  TOPIC_PROTEST_ID,
  TOPIC_WATCH_ID,
  SITE_MOBILE_URL,
  SITE_DESCRIPTION,
  SITE_OGIMAGE,
  SITE_TITLE,
  SITE_URL,
} from './constants'

import TimelineBody from './components/timeline/TimelineBody.vue'
import TimelineHeadline from './components/timeline/TimelineHeadline.vue'
import PresidentElectionProgress from './components/PresidentElectionProgress.vue'
import PresidentElectionList from './components/PresidentElectionList.vue'
import LeadingWatch from './components/LeadingWatch.vue'
import GroupList from './components/GroupList.vue'
import Leading from './components/Leading.vue'
import Loading from './components/Loading.vue'
import MoreFull from './components/MoreFull.vue'
import PortraitWallList from './components/PortraitWallList.vue'
import Share from './components/Share.vue'
import WineWarning from './components/WineWarning.vue'
import ArticleListFull from './components/ArticleListFull.vue'
import ArticleList from './components/ArticleList.vue'
import ProjectSliderContainer from './components/project/ProjectSliderContainer.vue'
// eslint-disable-next-line no-unused-vars
import { createStore } from './store'
import ListBody from './components/list/ListBody.vue'

const MAXRESULT = 12
const PAGE = 1
const WINE_TOPICS_ID = [
  '5c25f9e3315ec51000903a82',
  '5d22bb9fe311f3925c49396c',
  '5a4d8e60160ac91000294611',
  '5ff7d152127ff40f00d7125c',
  '61d6ade96fef6b0f00f8407e',
  '63b7907e7d893f1a00f1ddb1',
]
const PRESIDENT_ELECTION_ID = '5c766e19315ec51000909259'

// eslint-disable-next-line no-unused-vars
const fetchData = (store, id) => {
  return Promise.all([
    store.dispatch('deprecatedStore/FETCH_COMMONDATA', {
      endpoints: ['sections', 'projects', 'topics'],
    }),
    fetchPartners(store),
  ])
    .then(() => {
      if (!_.find(_.get(store.getters.topics, ['items']), { id })) {
        return fetchTopicByUuid(store, id)
      }
    })
    .then(() => {
      const topicType =
        _.get(_.find(_.get(store.getters.topics, ['items']), { id }), [
          'type',
        ]) || _.get(store.getters.topic, ['items', '0', 'type'])
      if (topicType === 'timeline') {
        return fetchTimeline(store, id)
      }
    })
}

const fetchEvent = (store, eventType = 'embedded') => {
  return store.dispatch('deprecatedStore/FETCH_EVENT', {
    params: {
      max_results: 1,
      where: {
        isFeatured: true,
        eventType,
      },
    },
  })
}

const fetchPartners = (store) => {
  const page =
    _.get(store.state.deprecatedStore, ['partners', 'meta', 'page'], 0) + 1
  return store
    .dispatch('deprecatedStore/FETCH_PARTNERS', {
      params: {
        max_results: 25,
        page,
      },
    })
    .then(() => {
      if (
        _.get(store.state.deprecatedStore, ['partners', 'items', 'length']) <
        _.get(store.state.deprecatedStore, ['partners', 'meta', 'total'])
      ) {
        fetchPartners(store)
      }
    })
}

const fetchTimeline = (store, id) => {
  return store.dispatch('deprecatedStore/FETCH_TIMELINE', {
    id,
  })
}

const fetchTopicByUuid = (store, uuid) => {
  return store.dispatch('deprecatedStore/FETCH_TOPIC_BY_UUID', {
    params: {
      where: {
        _id: uuid,
      },
    },
  })
}

const fetchTopicImages = (store, uuid) => {
  return store.dispatch('deprecatedStore/FETCH_IMAGES', {
    uuid,
    type: TOPIC,
    params: {
      max_results: 25,
    },
  })
}

const fetchTopicAllImages = (store, uuid) => {
  const page =
    _.get(store.state.deprecatedStore, ['images', 'meta', 'page'], 0) + 1
  return store
    .dispatch('deprecatedStore/FETCH_IMAGES', {
      uuid,
      type: TOPIC,
      params: {
        max_results: 25,
        page,
      },
    })
    .then(() => {
      if (
        _.get(store.state.deprecatedStore, ['images', 'items', 'length']) <
        _.get(store.state.deprecatedStore, ['images', 'meta', 'total'])
      ) {
        fetchTopicAllImages(store, uuid)
      }
    })
}

const fetchArticlesByUuid = (
  store,
  uuid,
  type,
  isLoadMore,
  useMetaEndpoint,
  maxResult = MAXRESULT
) => {
  const page = isLoadMore || PAGE
  return store.dispatch('deprecatedStore/FETCH_ARTICLES_BY_UUID', {
    uuid,
    type,
    params: {
      page,
      max_results: maxResult,
      useMetaEndpoint,
    },
  })
}

const fetchAllArticlesByUuid = (store, uuid, type, useMetaEndpoint) => {
  const page =
    _.get(
      store.state.deprecatedStore,
      ['articlesByUUID', 'TOPIC', uuid, 'meta', 'page'],
      0
    ) + 1
  return store
    .dispatch('deprecatedStore/FETCH_ARTICLES_BY_UUID', {
      uuid,
      type,
      params: {
        page,
        max_results: 10,
        useMetaEndpoint,
      },
    })
    .then(() => {
      if (
        _.get(store.state.deprecatedStore, [
          'articlesByUUID',
          'TOPIC',
          uuid,
          'items',
          'length',
        ]) <
        _.get(store.state.deprecatedStore, [
          'articlesByUUID',
          'TOPIC',
          uuid,
          'meta',
          'total',
        ])
      ) {
        fetchAllArticlesByUuid(store, uuid, type, useMetaEndpoint)
      }
    })
}
export default {
  name: 'Topic',
  layout: 'default',
  components: {
    'article-list': ArticleList,
    'article-list-full': ArticleListFull,
    'group-list': GroupList,
    leading: Leading,
    'leading-watch': LeadingWatch,
    loading: Loading,
    'more-full': MoreFull,
    'portraitWall-list': PortraitWallList,
    share: Share,
    'timeline-body': TimelineBody,
    'timeline-headline': TimelineHeadline,
    'vue-dfp-provider': VueDfpProvider,
    WineWarning,
    ProjectSliderContainer,
    PresidentElectionProgress,
    PresidentElectionList,
    ListBody,
  },

  /*
   * asyncData({ store, route }) {
   *   return fetchData(store, route.params.topicId)
   * },
   */
  async fetch() {
    await fetchData(this.$store, this.$route.params.topicId)
    await this.beforeRouteUpdate({ path: this.$route.path }, '', () => {})
    if (this.shouldRenderRedesignTopicList) {
      const typeOfIsFeaturedArticles = [true, false]
      await Promise.all(
        typeOfIsFeaturedArticles.map((item) => this.fetchList(1, item))
      )
      this.concatArticleList()
    }

    /**
     * function of computing variable `metaTopicKeywords`
     * see comment at `metaTopicKeywords` to realize why use $fetchTopic and $fetchTags is needed.
     * @type {{tags: string[]| [] }}}
     */
    const data = await this.$fetchTopic(this.$route.params.topicId)
    if (data?.tags?.length !== 0) {
      const tagsRes = await this.$fetchTags({
        id: data?.tags,
      })

      this.tagsName = tagsRes.items.map((i) => i.name)
    }
  },
  data() {
    return {
      tagsName: [],

      // data for new feature
      pageOfNotFeaturedArticle: 1,
      pageOfIsFeaturedArticle: 1,
      articlesIsNotFeatured: [],
      articlesIsFeatured: [],
      articlesIsNotFeaturedCount: 0,
      articlesIsFeaturedCount: 0,

      //

      abIndicator: '',
      articleListAutoScrollHeight: 0,
      canScrollLoadMord: true,
      commonData: this.$store.state.deprecatedStore.commonData,
      dfpid: DFP_ID,
      dfpHeaderLogoLoaded: false,
      dfpMode: 'prod',
      dfpUnits: DFP_UNITS,
      isVponSDKLoaded: false,
      loading: false,
      showDfpCoverAdFlag: false,
      showDfpCoverAd2Flag: false,
      showDfpCoverAdVponFlag: false,
      showDfpHeaderLogo: false,
      siteTitle: SITE_TITLE,
      viewport: undefined,
      persidentCandidateData: [
        {
          tagId: '5d65fbaa486faa3919afaeb9',
          title: '民進黨',
          img: '/deprecated/topic-page/assets/mirrormedia/2020-1.jpg',
          color: '#5dc68a',
          articles: [],
        },
        {
          tagId: '5d65fbaf486faa3919afaeba',
          title: '國民黨',
          img: '/deprecated/topic-page/assets/mirrormedia/2020-2.jpeg',
          color: '#4a90e2',
          articles: [],
        },
        {
          tagId: '5d65fbb6486faa3919afaebb',
          title: '親民黨及第三勢力',
          img: '/deprecated/topic-page/assets/mirrormedia/2020-5.jpg',
          color: '#9b9b9b',
          articles: [],
        },
      ],
      dfpPos: '',
    }
  },
  computed: {
    articles() {
      return _.uniqBy(
        _.get(this.$store.state.deprecatedStore, [
          'articlesByUUID',
          TOPIC,
          this.uuid,
          'items',
        ]),
        'slug'
      )
    },
    articleUrl() {
      return `${SITE_URL}/topic/${this.currArticleSlug}/`
    },
    autoScrollArticles() {
      if (this.topicType === 'wide') {
        return _.take(this.articles, 3)
      }
      return _.take(this.articles, 12)
    },
    autoScrollArticlesLoadMore() {
      if (this.topicType === 'wide') {
        return _.slice(this.articles, 3)
      }
      return _.slice(this.articles, 12)
    },
    shouldRenderRedesignTopicList() {
      return this.topicType === 'list'
    },
    shouldLoadMoreNotFeaturedArticles() {
      return (
        this.articlesIsNotFeaturedCount - this.articlesIsNotFeatured?.length > 0
      )
    },
    shouldLoadMoreIsFeaturedArticles() {
      return this.articlesIsFeaturedCount - this.articlesIsFeatured?.length > 0
    },

    candidateData() {
      this.persidentCandidateData.forEach((cand) => {
        cand.articles = _.uniqBy(
          _.get(this.$store.state.deprecatedStore, [
            'articlesByUUID',
            TAG,
            cand.tagId,
            'items',
          ]),
          'slug'
        )
      })
      return this.persidentCandidateData
    },
    customCSS() {
      return _.get(this.topic, ['style'], null)
    },
    customJS() {
      return _.get(this.topic, ['javascript'], null)
    },
    currArticleSlug() {
      // return this.$store.state.deprecatedStore.route.params.topicId
      return this.$route.params.topicId
    },
    dfp() {
      return _.get(this.topic, ['dfp'], null)
    },
    dfpOptions() {
      const currentInstance = this
      return Object.assign({}, DFP_OPTIONS, {
        afterEachAdLoaded(event) {
          const dfpCover = document.querySelector(
            `#${event.slot.getSlotElementId()}`
          )
          const position = dfpCover.getAttribute('pos')

          /**
           * Because googletag.pubads().addEventListener('slotRenderEnded', afterEachAdLoaded) can't be removed.
           * We have check if current page gets changed with checking by sessionId to prevent from runnig this outdated callback.
           */
          const elSessionId = dfpCover.getAttribute('sessionId')
          if (elSessionId !== this.sessionId) {
            return
          }

          const adDisplayStatus = dfpCover.currentStyle
            ? dfpCover.currentStyle.display
            : window.getComputedStyle(dfpCover, null).display

          switch (position) {
            case 'LOGO':
              if (adDisplayStatus !== 'none') {
                currentInstance.showDfpHeaderLogo = true
              }
              currentInstance.dfpHeaderLogoLoaded = true
              break
          }
          adtracker({
            el: dfpCover,
            slot: event.slot.getSlotElementId(),
            position,
            isAdEmpty: adDisplayStatus === 'none',
            sessionId: elSessionId,
          })
        },
        setCentering: true,
        sizeMapping: DFP_SIZE_MAPPING,
      })
    },
    eventLogo() {
      return _.get(this.$store.state.deprecatedStore.eventLogo, ['items', '0'])
    },
    fbAppId() {
      return _.get(this.$store, ['state', 'fbAppId'])
    },
    hasAutoScroll() {
      return (
        _.get(
          this.$store.state.deprecatedStore,
          ['articlesByUUID', TOPIC, this.uuid, 'meta', 'page'],
          PAGE
        ) !== 1
      )
    },
    hasDFP() {
      return this.dfp !== '' || this.mobileDfp !== ''
    },
    hasMore() {
      return (
        _.get(
          this.$store.state.deprecatedStore,
          ['articlesByUUID', TOPIC, this.uuid, 'items', 'length'],
          0
        ) <
        _.get(
          this.$store.state.deprecatedStore,
          ['articlesByUUID', TOPIC, this.uuid, 'meta', 'total'],
          0
        )
      )
    },
    isPresidentElectionId() {
      return this.uuid === PRESIDENT_ELECTION_ID
    },
    mobileDfp() {
      return _.get(this.topic, ['mobileDfp'], null)
    },
    highlightNodes() {
      return _.get(this.$store.state.deprecatedStore, ['timeline', 'nodes'])
    },
    isTimeline() {
      return this.$route.params.topicId === TOPIC_PROTEST_ID
    },
    page() {
      return _.get(
        this.$store.state.deprecatedStore,
        ['articlesByUUID', TOPIC, this.uuid, 'meta', 'page'],
        PAGE
      )
    },
    pageStyle() {
      return _.get(this.topic, ['pageStyle'])
    },
    portraitWallListImages() {
      return _.filter(_.get(this.mediaData, ['images', 'items']), (i) => {
        return _.indexOf(i.keywords, '@') === -1
      })
    },
    portraitWallSlideImages() {
      const slideImages = _.filter(
        _.get(this.$store.state.deprecatedStore, ['images', 'items']),
        (i) => {
          return _.indexOf(i.keywords, '@') !== -1
        }
      )
      return {
        images: {
          items: slideImages,
        },
      }
    },
    projects() {
      return _.get(this.commonData, ['projects', 'items'])
    },
    sectionId() {
      return 'other'
    },
    sectionName() {
      switch (this.$route.params.topicId) {
        case TOPIC_WATCH_ID:
          return 'watch'
        default:
          return 'other'
      }
    },
    tags() {
      return _.filter(
        _.get(this.$store.state.deprecatedStore, ['tags']),
        (t) => {
          return _.includes(_.get(this.topic, ['tags']), t.id)
        }
      )
    },
    timeline() {
      return _.get(this.$store.state.deprecatedStore, ['timeline'])
    },
    topic() {
      if (
        _.find(_.get(this.$store.state.deprecatedStore.topics, ['items']), {
          id: this.uuid,
        })
      ) {
        return _.find(
          _.get(this.$store.state.deprecatedStore.topics, ['items']),
          {
            id: this.uuid,
          }
        )
      } else {
        return _.get(this.$store.state.deprecatedStore, ['topic', 'items', '0'])
      }
    },
    topicType() {
      return _.camelCase(_.get(this.topic, 'type', ''))
    },
    mediaData() {
      return {
        images: _.get(this.$store.state.deprecatedStore, ['images', this.uuid]),
      }
    },
    needWineWarning() {
      return WINE_TOPICS_ID.some((id) => this.uuid === id)
    },
    uuid() {
      return this.$route.params.topicId
    },
    viewportTarget() {
      if (this.viewport < 600) {
        return 'mobile'
      } else if (this.viewport > 600 && this.viewport < 1200) {
        return 'tablet'
      } else {
        return 'desktop'
      }
    },

    metaDescription() {
      if (this?.topic?.ogDescription) {
        return getTruncatedVal(this?.topic?.ogDescription, 50)
      } else if (this.topic?.brief?.html) {
        return getBrief(this.topic, 50)
      }
      return SITE_DESCRIPTION
    },

    /*
     * Originally, we use computed variable `this.tags`and transform it to string, then assign it as content of meta `keywords`.
     * However, some bug is happened at unknown situation:
     * `this.tag` will not be updated to the status of cms at unknown situation.
     * Because the structure of code at Topic page is too complex and hard to refactor, we not to trace root case, but rewrite another logic of getting tags:
     * we use function `this.$fetchTopic` to get id of tags which certain topic page contain, and use function `this.$fetchTags` to get name of tags.
     * After we get name of tags, we transform it to string, then assign it as content of meta `keywords`..
     */
    metaTopicKeywords() {
      if (Array.isArray(this.tagsName) && this.tagsName.length !== 0) {
        return this.tagsName.join(', ')
      }
      return undefined
    },
  },
  watch: {
    uuid() {
      this.$forceUpdate()
      if (process.env.VUE_ENV === 'client') {
        /*
         * window.ga('send', 'pageview', {
         *   title: `${_.get(this.topic, ['name'])} - ${SITE_TITLE}`,
         *   location: document.location.href,
         * })
         */
        if (this.topicType === 'list' || this.topicType === 'wide') {
          window.removeEventListener('scroll', this.scrollHandler)
          window.addEventListener('scroll', this.scrollHandler)
        } else {
          window.removeEventListener('scroll', this.scrollHandler)
        }
        if (this.topicType === 'timeline') {
          window.removeEventListener('scroll', this.timelineScrollHandler)
          window.addEventListener('scroll', this.timelineScrollHandler)
        } else {
          window.removeEventListener('scroll', this.timelineScrollHandler)
        }
      }
    },
    customCSS() {
      if (process.env.VUE_ENV === 'client') {
        this.updateCustomizedMarkup()
      }
    },
    articleUrl() {
      if (process.env.VUE_ENV === 'client') {
        window.FB &&
          window.FB.init({
            appId: this.fbAppId,
            xfbml: true,
            version: 'v2.0',
          })
        window.FB && window.FB.XFBML.parse()
      }
    },
  },
  created() {
    this.dfpPos = this.$ua.isFromPc() ? 'LPCFT' : 'LMBFT'
  },
  beforeMount() {
    fetchEvent(this.$store, 'logo')
    if (this.topicType !== 'timeline') {
      if (this.topicType === 'portraitWall') {
        fetchAllArticlesByUuid(this.$store, this.uuid, TOPIC, false)
      } else if (this.topicType === 'group') {
        fetchAllArticlesByUuid(this.$store, this.uuid, TOPIC, true)
      } else if (this.topicType === 'wide') {
        fetchArticlesByUuid(this.$store, this.uuid, TOPIC, false, false, 3)
      } else if (this.uuid === PRESIDENT_ELECTION_ID) {
        this.persidentCandidateData.forEach((cand) => {
          fetchArticlesByUuid(this.$store, cand.tagId, TAG, false, false, 3)
        })
      } else {
        fetchArticlesByUuid(this.$store, this.uuid, TOPIC, false, false)
      }
      fetchTopicAllImages(this.$store, this.uuid)
    }

    // this.abIndicator = this.getMmid()
  },
  mounted() {
    this.updateViewport()
    this.insertCustomizedMarkup()
    this.checkIfLockJS()
    this.updateSysStage()

    // window.ga('set', 'contentGroup1', '')
    // window.ga('set', 'contentGroup2', '')
    // window.ga('set', 'contentGroup3', '')
    //
    // // window.ga('set', 'contentGroup3', `topic${this.abIndicator}`)
    // window.ga('send', 'pageview', {
    //   title: `${_.get(this.topic, ['name'])} - ${SITE_TITLE}`,
    //   location: document.location.href,
    // })

    window.addEventListener('resize', this.updateViewport)
    if (this.topicType === 'list' || this.topicType === 'wide') {
      window.addEventListener('scroll', this.scrollHandler)
    }
    if (this.topicType === 'timeline') {
      window.addEventListener('scroll', this.timelineScrollHandler)
    }
  },
  updated() {
    this.updateSysStage()
  },
  destroyed() {
    window.removeEventListener('resize', this.updateViewport)
    window.removeEventListener('scroll', this.scrollHandler)
    window.removeEventListener('scroll', this.timelineScrollHandler)
  },
  methods: {
    concatArticleList() {
      if (this.articlesIsFeaturedCount < MAXRESULT) {
        this.articlesIsFeatured = this.articlesIsFeatured?.concat(
          _.take(
            this.articlesIsNotFeatured,
            MAXRESULT - this.articlesIsFeaturedCount
          )
        )
        this.articlesIsNotFeatured = this.articlesIsNotFeatured?.slice(
          MAXRESULT - this.articlesIsFeaturedCount,
          MAXRESULT
        )
      }
    },
    formatArticles(oldArticlesList, newArticlesList) {
      /*
       * three situation:
       * create new array, edit and extend existing array,
       * do not modify existing array
       */
      if (oldArticlesList?.length === 0) {
        return newArticlesList
      } else if (oldArticlesList?.length !== 0 && newArticlesList) {
        return oldArticlesList.concat(newArticlesList)
      } else {
        return oldArticlesList
      }
    },

    async fetchList(page, isFeatured = false) {
      const data = await this.$fetchStoryFromMembershipGateway({
        maxResults: MAXRESULT,
        isFeatured,
        sort: '-publishedDate',
        topics: [this.currArticleSlug],
        page,
      })
      if (isFeatured) {
        this.articlesIsFeatured =
          this.formatArticles(this.articlesIsFeatured, data?.items) || []
        this.articlesIsFeaturedCount = data?.meta?.total || 0
      } else {
        this.articlesIsNotFeatured =
          this.formatArticles(this.articlesIsNotFeatured, data?.items) || []
        this.articlesIsNotFeaturedCount = data?.meta?.total || 0
      }
    },
    loadMoreIsFeaturedArticles() {
      this.pageOfIsFeaturedArticle += 1
      this.loading = true
      this.fetchList(this.pageOfIsFeaturedArticle, true).then(() => {
        this.loading = false
      })
    },
    checkIfLockJS() {
      unLockJS()
    },
    currentYPosition,
    elmYPosition,
    getMmid() {
      const mmid = Cookie.get('mmid')
      let assisgnedRole = _.get(this.$route, ['query', 'ab'])
      if (assisgnedRole) {
        assisgnedRole = assisgnedRole.toUpperCase()
      }
      const role = getRole({
        mmid,
        distribution: [
          { id: 'A', weight: 50 },
          { id: 'B', weight: 50 },
        ],
      })
      return assisgnedRole || role
    },
    getValue,
    insertCustomizedMarkup() {
      const custCss = document.createElement('style')
      const custScript = document.createElement('script')
      custCss.setAttribute('id', 'custCSS')
      custScript.setAttribute('id', 'custJS')

      if (this.customCSS) {
        custCss.appendChild(document.createTextNode(this.customCSS))
      }
      if (this.customJS) {
        custScript.appendChild(document.createTextNode(this.customJS))
      }
      if (
        !document.getElementById('custCSS') ||
        !document.getElementById('custJS')
      ) {
        document.querySelector('body').appendChild(custCss)
        document.querySelector('body').appendChild(custScript)
      } else {
        document.querySelector('#custCSS').innerHTML = this.customCSS
        document.querySelector('#custJS').innerHTML = this.customJS
      }
    },

    loadMore() {
      // loadMore for new design topic list
      if (this.shouldRenderRedesignTopicList) {
        this.pageOfNotFeaturedArticle += 1
        this.loading = true
        this.fetchList(this.pageOfNotFeaturedArticle, false).then(() => {
          this.loading = false
          this.canScrollLoadMord = true
        })
      } // original loadMore
      else {
        const maxResult = this.topicType === 'wide' ? 3 : MAXRESULT
        let currentPage = this.page
        currentPage += 1
        this.loading = true

        fetchArticlesByUuid(
          this.$store,
          this.uuid,
          TOPIC,
          currentPage,
          false,
          maxResult
        ).then(() => {
          this.loading = false
          this.canScrollLoadMord = true
        })
      }
    },
    loadMorePresident(tagId, page) {
      fetchArticlesByUuid(this.$store, tagId, TAG, page, false, 3)
    },
    pageNotFoundHandler() {
      const e = new Error()
      e.massage = 'Page Not Found'
      e.code = '404'
      throw e
    },
    scrollHandler() {
      // scrollHandler for new design topic list
      if (this.shouldRenderRedesignTopicList) {
        if (this.$refs.articleListIsNotFeatured) {
          const vh =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight
          const currentBottom = this.currentYPosition() + vh
          const articleListBottom =
            this.elmYPosition('#articleListIsNotFeatured') +
            this.$refs.articleListIsNotFeatured.$el.offsetHeight

          if (
            this.shouldLoadMoreNotFeaturedArticles &&
            this.canScrollLoadMord &&
            currentBottom > articleListBottom - 300
          ) {
            this.canScrollLoadMord = false
            this.loadMore()
          }
        }
      }

      // original function
      else if (this.$refs.articleList) {
        const vh =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight
        const currentBottom = this.currentYPosition() + vh
        const articleListBottom =
          this.elmYPosition('#articleList') +
          this.$refs.articleList.$el.offsetHeight

        this.articleListAutoScrollHeight =
          this.$refs.articleListAutoScroll.$el.offsetHeight
        const articleListAutoScrollBottom =
          this.elmYPosition('#articleListAutoScroll') +
          this.articleListAutoScrollHeight
        if (
          this.hasMore &&
          this.page === 1 &&
          this.canScrollLoadMord &&
          currentBottom > articleListBottom - 300
        ) {
          this.canScrollLoadMord = false
          this.loadMore()
        }
        if (
          this.hasMore &&
          this.page > 1 &&
          this.canScrollLoadMord &&
          currentBottom > articleListAutoScrollBottom - 300
        ) {
          this.canScrollLoadMord = false
          this.loadMore()
        }
      }
    },
    timelineScrollHandler() {
      const windowHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      const timelineBodyBriefHeight = document.querySelector(
        '.timelineBody__brief'
      ).offsetHeight
      const activityBoxHeight = document.querySelector(
        '.timelineMenu-activityBox'
      ).offsetHeight
      const cutHeight = windowHeight / 2 + timelineBodyBriefHeight + 20

      if (this.currentYPosition() - cutHeight > 0) {
        const timelineMenuStartTop = this.currentYPosition() - cutHeight
        const onCenterIndex = Math.floor(
          timelineMenuStartTop / activityBoxHeight
        )
        const activityBoxs = document.querySelectorAll(
          '.timelineMenu-activityBox'
        )
        for (let i = 0; i < activityBoxs.length; i += 1) {
          activityBoxs[i].classList.remove('onCenter')
        }
        activityBoxs[onCenterIndex].classList.add('onCenter')
      }
    },
    updateCustomizedMarkup() {
      const custCss = document.querySelector('#custCSS')
      const custScript = document.querySelector('#custJS')
      custCss.innerHTML = ''
      custScript.innerHTML = ''
      if (this.customCSS) {
        custCss.innerHTML = this.customCSS
      }
      if (this.customJS) {
        custScript.innerHTML = this.customJS
      }
    },
    updateViewport() {
      if (process.env.VUE_ENV === 'client') {
        this.viewport = Math.min(
          window.innerWidth,
          document.documentElement.clientWidth
        )
      }
    },
    updateSysStage() {
      this.dfpMode = currEnv()
    },
    async beforeRouteUpdate(to, from, next) {
      let topicType
      const uuid = _.split(to.path, '/')[2]
      const topic = _.find(
        _.get(this.$store.state.deprecatedStore.topics, ['items']),
        { id: uuid },
        undefined
      )
      if (!topic) {
        await fetchTopicByUuid(this.$store, uuid).then(async () => {
          topicType = _.camelCase(
            _.get(this.$store.state.deprecatedStore.topic, [
              'items',
              '0',
              'type',
            ])
          )
          if (topicType === 'group') {
            return await Promise.all([
              fetchAllArticlesByUuid(this.$store, uuid, TOPIC, true),
              fetchTopicImages(this.$store, uuid),
            ]).then(next())
          } else if (topicType === 'portraitWall') {
            return await Promise.all([
              fetchAllArticlesByUuid(this.$store, uuid, TOPIC, false),
              fetchTopicImages(this.$store, uuid),
            ]).then(next())
          } else if (topicType === 'timeline') {
            return await Promise.all([
              fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false),
              fetchTopicImages(this.$store, uuid),
              fetchTimeline(this.$store, uuid),
            ]).then(next())
          } else if (topicType === 'wide') {
            return await Promise.all([
              fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false, 3),
              fetchTopicImages(this.$store, uuid),
            ]).then(next())
          } else {
            return await Promise.all([
              fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false),
              fetchTopicImages(this.$store, uuid),
            ]).then(next())
          }
        })
      } else {
        topicType = _.camelCase(_.get(topic, ['type']))
        if (topicType === 'group') {
          await Promise.all([
            fetchAllArticlesByUuid(this.$store, uuid, TOPIC, true),
            fetchTopicImages(this.$store, uuid),
          ]).then(next())
        } else if (topicType === 'portraitWall') {
          await Promise.all([
            fetchAllArticlesByUuid(this.$store, uuid, TOPIC, false),
            fetchTopicImages(this.$store, uuid),
          ]).then(next())
        } else if (topicType === 'timeline') {
          await Promise.all([
            fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false),
            fetchTopicImages(this.$store, uuid),
            fetchTimeline(this.$store, uuid),
          ]).then(next())
        } else if (topicType === 'wide') {
          await Promise.all([
            fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false, 3),
            fetchTopicImages(this.$store, uuid),
          ]).then(next())
        } else {
          await Promise.all([
            fetchArticlesByUuid(this.$store, uuid, TOPIC, false, false),
            fetchTopicImages(this.$store, uuid),
          ]).then(next())
        }
      }
    },
  },

  /*
   * middleware({ store }) {
   *   store.registerModule('deprecatedStore', createStore())
   * },
   */
  head() {
    const {
      heroImage = {},
      ogImage = {},
      ogTitle = '',
      name = '',
      subtitle = '',
    } = this.topic
    const metaTitle = ogTitle || name
    const metaImage = ogImage
      ? _.get(ogImage, 'image.resizedTargets.desktop.url')
      : _.get(heroImage, 'image.resizedTargets.desktop.url', SITE_OGIMAGE)
    const ogUrl = `${SITE_URL}${this.$route.path}`
    const relUrl = `${SITE_MOBILE_URL}${this.$route.path}`
    return {
      title: metaTitle,
      meta: [
        { name: 'robots', content: 'index' },
        subtitle
          ? { hid: 'subtitle', name: 'subtitle', content: subtitle }
          : {},
        {
          hid: 'description',
          name: 'description',
          content: this.metaDescription,
        },
        { hid: 'og:title', property: 'og:title', content: metaTitle },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.metaDescription,
        },
        { hid: 'og:url', property: 'og:url', content: ogUrl },
        { hid: 'og:image', property: 'og:image', content: metaImage },
        { hid: 'twitter:title', name: 'twitter:title', content: metaTitle },
        this.metaTopicKeywords
          ? {
              hid: 'keywords',
              property: 'keywords',
              content: `${this.metaTopicKeywords}`,
            }
          : {},
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.metaDescription,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: metaImage },
      ],
      link: [{ rel: 'alternate', href: relUrl }],
    }
  },
  beforeRouteLeave(to, from, next) {
    if (process.env.VUE_ENV === 'client') {
      const custCss = document.querySelector('#custCSS')
      const custScript = document.querySelector('#custJS')
      custCss.innerHTML = ''
      custScript.innerHTML = ''
    }
    next()
  },
}
</script>

<style lang="stylus" scoped>

.topic
  position relative
  width 100%
  padding-top 66.66%
  background-color rgba(135, 156, 169, 0.15)
  margin-bottom 20px
  background-repeat no-repeat
  background-position center center
  background-size cover
  &-view
    background-color #f2f2f2
  &-title
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    width 80%
    height 50%
    background-size cover
    background-repeat no-repeat
    h1
      margin 0

.topic-view.portraitWall
  .topic
    margin 0

.topicTimeline
  &__logo
    position fixed
    z-index 999
    top 5px
    left 5px
    width 40px
    height 40px
    > img
      width 100%
  &__projects
    width 100%
    padding 1em
    background-color #4d4d4d
    .project-container
      margin 1em 0
      background-color #fff
      .proj_title
        display none
    > h1
      margin 0
      color #fff
      text-align center
      font-weight 200

@media (min-width: 600px)
  .topic-view.wide
    .listArticleBlock
      display flex
      width 100%
      margin 0 10px
      & + .listArticleBlock
        margin-top 40px
        margin-bottom 0
      &__figure
        width 50%
        padding-top 33.33%
        &--colorBlock
          display none
      &__content
        display flex
        flex-direction column
        align-items flex-start
        width 50%
        padding 40px 30px 30px
        h2
          min-height 0
          padding 0
          font-size 1.6rem
          font-weight bold
        p
          margin-top 1em
          font-size 1.2rem
        &--colorBlock
          display block
          margin-bottom 1em
          padding .5em
          color #fff
          letter-spacing 1px

  .topicTimeline
    &__projects
      padding 5% 10%

@media (min-width: 900px)
  .topic
    height 600px
    padding-top 0
    &-title
      height 200px
      width 400px
      color #fff
      background-size contain
      background-position center center

.ad-container
  display flex
  justify-content center
  align-items center
</style>
