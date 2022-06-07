<template>
  <section class="page">
    <div class="page-wrapper">
      <ContainerGptAd
        v-if="!isPremiumMember"
        class="ad"
        pageKey="5fe1770b1b3e3a0f00328cdb"
        adKey="HD"
      />
      <a href="/subscribe" class="page__banner" />
      <div
        v-for="section in data"
        :key="section.id"
        class="page__section section"
      >
        <UiBreadcrumb
          class="section__breadcrumb"
          :breadcrumbs="createSectionBreadcrumb(section)"
          :separatorColor="'#054F77'"
        />
        <ol class="section__list list">
          <li
            v-for="article in section.latest"
            :key="article.id"
            class="list__item item"
          >
            <UiArticleCardPremium
              class="item__card card"
              :href="transformListItemContent(article).href"
              :imgSrc="transformListItemContent(article).imgSrc"
              :infoTitle="transformListItemContent(article).infoTitle"
              :infoDescription="
                transformListItemContent(article).infoDescription
              "
              :infoDate="transformListItemContent(article).infoDate"
            />
          </li>
        </ol>
      </div>
    </div>
    <ContainerGptAd
      v-if="!isPremiumMember"
      class="ad"
      pageKey="5fe1770b1b3e3a0f00328cdb"
      adKey="FT"
    />
  </section>
</template>

<script>
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import UiBreadcrumb from '~/components/UiBreadcrumb.vue'
import UiArticleCardPremium from '~/components/UiArticleCardPremium.vue'
import { getStoryPath, stripHtmlTags } from '~/utils/article'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '~/constants'

export default {
  layout: 'premium',
  components: {
    UiBreadcrumb,
    UiArticleCardPremium,
    ContainerGptAd,
  },

  async fetch() {
    this.data = await this.$fetchMemberSectionsArticles()
  },

  data() {
    return {
      data: [],
    }
  },

  computed: {
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
    },
  },

  methods: {
    createSectionBreadcrumb(section) {
      return [
        {
          text: section.title,
          link: `/premiumsection/${section.name}`,
          color: '#054F77',
        },
      ]
    },
    transformListItemContent(item = {}) {
      item = item || {}
      const section = item.sections?.[0] || {}
      const brief =
        (typeof item.brief === 'string' ? item.brief : item.brief?.html) ?? ''

      return {
        id: item.id,
        href: getStoryPath(item),
        imgSrc: item.heroImage?.image?.resizedTargets?.mobile?.url,
        imgText: section.title ?? '',
        infoTitle: item.title ?? '',
        infoDescription: stripHtmlTags(brief),
        infoDate: new Date(item.publishedDate),
      }
    },
  },

  head() {
    const title = `會員專區 - ${SITE_TITLE}`
    const description = SITE_DESCRIPTION

    return {
      title,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/section/member`,
        },
        {
          hid: 'section-name',
          name: 'section-name',
          content: '會員專區',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.page {
  background-color: #f2f2f2;
  padding: 24px 0 48px 20px;
  @include media-breakpoint-up(md) {
    padding: 48px 0 48px 48px;
  }
  @include media-breakpoint-up(xl) {
    padding: 60px 88px;
  }

  &__banner {
    background: url('../../assets/subscribe_banner_mobile.jpg');
    width: calc(100% - 20px);
    height: 0;
    padding-bottom: calc((100% - 20px) * 0.21);
    display: block;
    background-size: contain;
    margin-bottom: 24px;
    @include media-breakpoint-up(md) {
      background: url('../../assets/subscribe_banner.jpg');
      padding-bottom: 11.7%;
      background-size: contain;
    }
  }

  &__section {
    & + & {
      margin: 48px 0 0 0;
      @include media-breakpoint-up(md) {
        margin: 60px 0 0 0;
      }
      @include media-breakpoint-up(xl) {
        margin: 80px 0 0 0;
      }
    }
  }
}

.page-wrapper {
  @include media-breakpoint-up(xl) {
    max-width: 1024px;
    margin: 0 auto;
  }
}

.section {
  &__list {
    margin: 16px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 24px 0 0 0;
    }
    @include media-breakpoint-up(xl) {
      margin: 2px 0 0 -32px;
    }
  }
}

.list {
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  @include media-breakpoint-up(xl) {
    flex-wrap: wrap;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  &__item {
    @include media-breakpoint-up(xl) {
      margin: 22px 0 0 32px;
    }
    & + & {
      margin: 0 0 0 12px;
      @include media-breakpoint-up(xl) {
        margin: 22px 0 0 32px;
      }
    }
  }
}

.item {
  display: flex;
  flex-direction: column;
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 10px;
  }
}

.ad {
  margin: 20px auto;
}
</style>
