import _ from 'lodash'
import { getSectionColor } from '~/utils/index.js'
import { stripHtmlTags, getStoryPath } from '~/utils/article.js'

function processList({
  getMaxResults,
  fetchList,
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
      shouldMountInfiniteLoading() {
        return this.$data.$_processList_list.maxPage >= 2
      },

      $_processList_maxResults() {
        return getMaxResults.call(this)
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
        const listTotal = response.meta?.total ?? 0

        this.$data.$_processList_list.maxPage = Math.ceil(
          listTotal / this.$_processList_maxResults
        )
      },
      $_processList_setListItems(response) {
        const items = (response.items || []).map(
          this.$_processList_transformListItemContent
        )

        this.$data.$_processList_list.items.push(...items)
      },
      $_processList_transformListItemContent(item = {}) {
        item = item || {}
        const section = item.sections?.[0] || {}

        return {
          id: item.id,
          href: getStoryPath(item),
          imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
          imgText: section.title ?? '',
          imgTextBackgroundColor: getSectionColor(section.name),
          infoTitle: item.title ?? '',
          infoDescription: stripHtmlTags(item.brief?.html ?? ''),
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

function processTwoLists({
  getMaxResults,
  fetchList,
  transformListItemContent,
} = {}) {
  return {
    mixins: [
      processList({
        getMaxResults,
        fetchList,
        transformListItemContent,
      }),
    ],

    computed: {
      listItemsInFirstPage() {
        return this.listItems.slice(0, this.$_processList_maxResults)
      },
      listItemsInLoadmorePage() {
        return this.listItems.slice(this.$_processList_maxResults, Infinity)
      },
      shouldMountLoadmoreList() {
        return this.listItemsInLoadmorePage.length > 0
      },
    },
  }
}

export { processList, processTwoLists }
