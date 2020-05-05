<template>
  <div>
    <nuxt />
    <UIArticleListItem
      :href="'http://www.google.com'"
      :img-src="'https://www.mirrormedia.com.tw/assets/images/20200505172059-1ef4fdcdc3b6296e85951ea330498ef5-mobile.jpg'"
      :img-text="'娛樂'"
      :img-text-background-color="'#BF3284'"
      :title="'郭富城正能量抗疫線上熱舞開唱為公益募款'"
      :description="'郭富城發動《郭富城鼓舞‧動起來網上慈善演唱會》， 為專業舞者及電影業界工作者籌款，發放正能…'"
    />
    <UIFooter />
  </div>
</template>

<script>
import UIFooter from '~/components/UIFooter.vue'
import UIArticleListItem from '~/components/UIArticleListItem.vue'

export default {
  components: {
    UIFooter,
    UIArticleListItem,
  },
}
</script>

<style lang="sass" scoped></style>
