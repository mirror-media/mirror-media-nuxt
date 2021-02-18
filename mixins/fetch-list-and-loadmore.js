import _ from 'lodash'
import { getSectionColor } from '~/utils/index.js'
import { stripHtmlTags, getStoryPath } from '~/utils/article.js'

export default function fetchListAndLoadmore({
  maxResults,
  fetchList,
  getListItems = function (response = {}) {
    return response.items || []
  },
  getListTotal = function (response = {}) {
    return response.meta?.total ?? 0
  },
  transformListItemContent,
} = {}) {
  return {
    data() {
      return {
        $_processList_list: {
          items: [],
          page: 0,
          maxPage: 0,
        },
      }
    },

    computed: {
      listItems() {
        return _.uniqBy(
          this.$data.$_processList_list.items,
          function identifyDuplicateById(item) {
            return item.id
          }
        )
      },
      shouldLoadmore() {
        return this.$data.$_processList_list.maxPage >= 2
      },

      $_processList_maxResults() {
        if (!maxResults) {
          throw new TypeError(
            'Invalid argument: type check failed for argument "maxResults".'
          )
        }

        if (typeof maxResults === 'function') {
          return maxResults.call(this)
        }

        return maxResults
      },
    },

    methods: {
      async initList() {
        const response = await this.$_processList_loadList()

        this.$_processList_setListMaxPage(response)
      },

      async $_processList_loadList() {
        this.$data.$_processList_list.page += 1

        const response =
          (await fetchList.call(this, this.$data.$_processList_list.page)) || {}

        this.$_processList_setListItems(response)

        return response
      },
      $_processList_setListMaxPage(response = {}) {
        const listTotal = getListTotal(response)

        this.$data.$_processList_list.maxPage = Math.ceil(
          listTotal / this.$_processList_maxResults
        )
      },
      $_processList_setListItems(response) {
        const items = getListItems(response).map(
          this.$_processList_transformListItemContent
        )

        this.$data.$_processList_list.items.push(...items)
      },
      $_processList_transformListItemContent(item = {}) {
        item = item || {}
        const section = item.sections?.[0] || {}
        const brief =
          (typeof item.brief === 'string' ? item.brief : item.brief?.html) ?? ''

        return {
          id: item.id,
          href: getStoryPath(item),
          imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
          imgText: section.title ?? '',
          imgTextBackgroundColor: getSectionColor(section.name),
          infoTitle: item.title ?? '',
          infoDescription: stripHtmlTags(brief),
          ...transformListItemContent?.call(this, item),
        }
      },

      async infiniteHandler(state) {
        try {
          await this.$_processList_loadList()

          if (
            this.$data.$_processList_list.page >=
            this.$data.$_processList_list.maxPage
          ) {
            state.complete()
          } else {
            state.loaded()
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err)
          state.error()
        }
      },
    },
  }
}
