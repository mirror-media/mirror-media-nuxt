<template>
  <section class="page">
    <h1 class="title">當期雜誌</h1>
    <div
      class="page__current-featured-magazine-wrapper current-featured-magazine-wrapper"
    >
      <UiMagazineFeatured
        :coverImgUrl="'https://a.ecimg.tw/items/DJAG27A9008VZDJ/000001_1523442734.jpg'"
        :label="'第 222 期'"
        :title="'半夜遛狗洩戀情 邱鋒澤祕密同居采子sdfsfsdf sfklsdfjlkjsf'"
        :descriptions="[
          '內文簡介 作者簡介 作者序 推薦序 目錄 電子書試閱by readmoo.com 內文簡介》 回TOP↑ 作者簡介》 作者序》 推薦序》 目錄 》',
          '內文簡介 作者簡介 作者序 推薦序 目錄 電子書試閱by readmoo.com 內文簡介》 回TOP↑ 作者簡介》 作者序》 推薦序》 目錄',
        ]"
        :downloadLink="'https://storage.googleapis.com/mirrormedia-files/assets/magazine/20210104134945-4751666ed64428f1c2e109e0f7eadc80.pdf'"
      />
    </div>
    <section
      class="page__magazine-showcase-list-wrapper magazine-showcase-list-wrapper"
    >
      <h1 class="title">所有期數</h1>
      <ol
        class="magazine-showcase-list-wrapper__magazine-showcase-list magazine-showcase-list"
      >
        <li
          v-for="item in 30"
          :key="item"
          class="magazine-showcase-list__list-item magazine-showcase-list-item"
        >
          <UiMagazineShowcaseItem
            :coverImgUrl="'https://a.ecimg.tw/items/DJAG27A9008VZDJ/000001_1523442734.jpg'"
            :label="'2021/01/01'"
            :title="'第 222 期'"
            :downloadLink="'https://storage.googleapis.com/mirrormedia-files/assets/magazine/20210104134945-4751666ed64428f1c2e109e0f7eadc80.pdf'"
          />
        </li>
      </ol>
    </section>
  </section>
</template>

<script>
import UiMagazineFeatured from '~/components/UiMagazineFeatured.vue'
import UiMagazineShowcaseItem from '~/components/UiMagazineShowcaseItem.vue'

export default {
  components: {
    UiMagazineFeatured,
    UiMagazineShowcaseItem,
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 48px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__current-featured-magazine-wrapper {
    margin: 24px 0 0 0;
  }
  &__magazine-showcase-list-wrapper {
    margin: 48px 0 0 0;
  }
}

.current-featured-magazine-wrapper {
  padding: 0 20px;
}

.title {
  font-size: 28px;
  font-weight: 400;
  color: #4a4a4a;
}

.magazine-showcase-list-wrapper {
  background-color: #f2f2f2;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 20px;
  &__magazine-showcase-list {
    margin: 24px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 40px 0 0 0;
    }
  }
  @include media-breakpoint-up(md) {
    padding: 32px 48px;
  }
  @include media-breakpoint-up(xl) {
    padding: 48px 0;
  }
}

.magazine-showcase-list {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  grid-auto-rows: auto;
  gap: 24px 16px;
  @include media-breakpoint-up(md) {
    grid-template-columns: repeat(auto-fit, minmax(144px, 1fr));
    gap: 40px 32px;
  }
  @include media-breakpoint-up(xl) {
    gap: 60px 48px;
    max-width: 1104px;
  }
}
</style>
