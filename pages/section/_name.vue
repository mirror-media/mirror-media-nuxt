<template>
  <section class="section">
    <div>
      <UIArticleList :list-title="'test'" :list-data="listData" />
    </div>
  </section>
</template>

<script>
import UIArticleList from '~/components/UIArticleList.vue'

export default {
  components: {
    UIArticleList,
  },
  data() {
    return {
      listData: [
        {
          href: '/',
          // imgSrc: 'test imgSrc',
          imgText: 'test imgText',
          imgTextBackgroundColor: 'black',
          infoTitle: 'test infoTitle',
          infoDescription: 'test infoDescription',
        },
        {
          href: '/',
          // imgSrc: 'test imgSrc',
          imgText: 'test imgText',
          imgTextBackgroundColor: 'black',
          infoTitle: 'test infoTitle',
          infoDescription: 'test infoDescription',
        },
        {
          href: '/',
          // imgSrc: 'test imgSrc',
          imgText: 'test imgText',
          imgTextBackgroundColor: 'black',
          infoTitle: 'test infoTitle',
          infoDescription: 'test infoDescription',
        },
        {
          href: '/',
          // imgSrc: 'test imgSrc',
          imgText: 'test imgText',
          imgTextBackgroundColor: 'black',
          infoTitle: 'test infoTitle',
          infoDescription: 'test infoDescription',
        },
        {
          href: '/',
          // imgSrc: 'test imgSrc',
          imgText: 'test imgText',
          imgTextBackgroundColor: 'black',
          infoTitle: 'test infoTitle',
          infoDescription: 'test infoDescription',
        },
        {
          href: '/',
          // imgSrc: 'test imgSrc',
          imgText: 'test imgText',
          imgTextBackgroundColor: 'black',
          infoTitle: 'test infoTitle',
          infoDescription: 'test infoDescription',
        },
      ],
    }
  },
}
</script>

<style lang="sass" scoped>
.section
  background-color: #f2f2f2
  padding: 36px 0
  @include media-breakpoint-up(md)
    padding: 36px 25px 72px 25px
  @include media-breakpoint-up(xl)
    max-width: 1024px
    padding: 0
    margin: auto
</style>
