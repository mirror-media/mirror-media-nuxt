import _ from 'lodash'

function processList({
  maxResults = 0,
  fetchList,
  transformListItemContent,
} = {}) {
  return {
    async fetch() {
      await this.$_processList_loadListInitial()
    },

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
    },

    methods: {
      async $_processList_loadListInitial() {
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
          listTotal / maxResults
        )
      },
      $_processList_setListItems(response) {
        const items = (response.items || []).map(
          transformListItemContent.bind(this)
        )

        this.$data.$_processList_list.items.push(...items)
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
  maxResults = 0,
  fetchList,
  transformListItemContent,
} = {}) {
  return {
    mixins: [processList({ maxResults, fetchList, transformListItemContent })],

    computed: {
      listItemsInFirstPage() {
        return this.listItems.slice(0, maxResults)
      },
      listItemsInLoadmorePage() {
        return this.listItems.slice(maxResults, Infinity)
      },
      shouldMountLoadmoreList() {
        return this.listItemsInLoadmorePage.length > 0
      },
    },
  }
}

export { processList, processTwoLists }
