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
  getPage = function (response = {}) {
    return response.meta?.total ?? 0
  },
  transformListItemContent,
} = {}) {
  return {
    data() {
      return {
        $_fetchListAndLoadmore_list: {
          items: [],
          page: 0,
          maxPage: 0,
        },
      }
    },

    computed: {
      listItems() {
        return _.uniqBy(
          this.$data.$_fetchListAndLoadmore_list.items,
          function identifyDuplicateById(item) {
            return item.id
          }
        )
      },
      nowPage() {
        return this.$data.$_fetchListAndLoadmore_list.page
      },
      shouldLoadmore() {
        return this.$data.$_fetchListAndLoadmore_list.maxPage >= 2
      },
      maxResults() {
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
        const response = await this.$_fetchListAndLoadmore_loadList()

        this.$_fetchListAndLoadmore_setListMaxPage(response)
      },

      async $_fetchListAndLoadmore_loadList() {
        this.$data.$_fetchListAndLoadmore_list.page += 1

        const response =
          (await fetchList.call(
            this,
            this.$data.$_fetchListAndLoadmore_list.page
          )) || {}

        this.$_fetchListAndLoadmore_setListItems(response)

        return response
      },
      $_fetchListAndLoadmore_setListMaxPage(response = {}) {
        const listTotal = getListTotal(response)

        this.$data.$_fetchListAndLoadmore_list.maxPage = Math.ceil(
          listTotal / this.maxResults
        )
      },
      $_fetchListAndLoadmore_setListItems(response) {
        const items = getListItems(response).map(
          this.$_fetchListAndLoadmore_transformListItemContent
        )

        this.$data.$_fetchListAndLoadmore_list.items.push(...items)
      },
      $_fetchListAndLoadmore_transformListItemContent(item = {}) {
        item = item || {}
        const section = item.sections?.[0] || {}
        const brief =
          (typeof item.brief === 'string' ? item.brief : item.brief?.html) ?? ''

        // for warmlife, just for prod
        item.slug = item.slug || item.name
        return {
          id: item.id || item._id,
          href: getStoryPath(item),
          imgSrc:
            item.heroImage?.image?.resizedTargets?.mobile?.url || item.thumb,
          imgText: section.title ?? '',
          imgTextBackgroundColor: section.name && getSectionColor(section.name),
          infoTitle: item.title ?? '',
          infoDescription: stripHtmlTags(brief),
          redirect: item.redirect ?? '',
          ...transformListItemContent?.call(this, item),
        }
      },

      async infiniteHandler(state) {
        try {
          await this.$_fetchListAndLoadmore_loadList()
          if (
            this.$data.$_fetchListAndLoadmore_list.page >=
            this.$data.$_fetchListAndLoadmore_list.maxPage
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
