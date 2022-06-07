<template>
  <div class="youtube-policies">
    本網頁使用
    <a
      href="https://developers.google.com/youtube/terms/developer-policies#definition-youtube-api-services"
      target="_blank"
      rel="noopener noreferrer"
    >
      YouTube API 服務</a
    >，詳見
    <a
      href="https://www.youtube.com/t/terms"
      target="_blank"
      rel="noopener noreferrer"
      >YouTube 服務條款</a
    >、
    <a
      href="https://policies.google.com/privacy"
      target="_blank"
      rel="noopener noreferrer"
    >
      Google 隱私權與條款</a
    >。鏡週刊
    <a
      href="https://www.mirrormedia.mg/story/privacy/"
      target="_blank"
      rel="noopener noreferrer"
      >隱私權政策</a
    >
  </div>
</template>

<script>
export default {
  name: 'UiYoutubePolicies',
}
</script>

<style lang="scss" scoped>
.youtube-policies {
  font-size: 12px;
  text-align: justify;
  @include media-breakpoint-up(md) {
    text-align: center;
  }
  a {
    color: #356d9c;
  }
}
</style>
