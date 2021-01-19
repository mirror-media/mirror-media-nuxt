<template>
  <section class="page">
    <h1 class="title">當期雜誌</h1>
    <UiMagazineFeatured
      class="page__current-featured-magazine"
      :coverImgUrl="'https://a.ecimg.tw/items/DJAG27A9008VZDJ/000001_1523442734.jpg'"
      :label="'第 222 期'"
      :title="'半夜遛狗洩戀情 邱鋒澤祕密同居采子sdfsfsdf sfklsdfjlkjsf'"
      :descriptions="[
        '內文簡介 作者簡介 作者序 推薦序 目錄 電子書試閱by readmoo.com 內文簡介》 回TOP↑ 作者簡介》 作者序》 推薦序》 目錄 》',
        '內文簡介 作者簡介 作者序 推薦序 目錄 電子書試閱by readmoo.com 內文簡介》 回TOP↑ 作者簡介》 作者序》 推薦序》 目錄',
      ]"
      :downloadLink="'https://storage.googleapis.com/mirrormedia-files/assets/magazine/20210104134945-4751666ed64428f1c2e109e0f7eadc80.pdf'"
    />
  </section>
</template>

<script>
import UiMagazineFeatured from '~/components/UiMagazineFeatured.vue'

export default {
  components: {
    UiMagazineFeatured,
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 48px 20px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__current-featured-magazine {
    margin: 24px 0 0 0;
  }
}

.title {
  font-size: 28px;
  font-weight: 400;
  color: #4a4a4a;
}
</style>
