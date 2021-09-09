<template>
  <div class="intro">
    <h1>歡迎加入鏡週刊會員訂閱服務</h1>
    <p>
      在資訊爆炸與碎片的年代，新聞更需回歸純粹，讓閱讀更清澈、真實與深度。因此我們秉持明鏡之心，充份反映事實，反映時代與反映人性，持續挖掘有料內容，以一手原創題材、深度調查報導為宗旨，讓閱聽大眾獲取最完整的資訊。
    </p>
    <p>
      <strong>
        10/5鏡週刊訂閱制正式上線，誠摯邀請您的加入，一起邁向新的新聞里程碑。
      </strong>
    </p>
  </div>
</template>

<style lang="scss" scoped>
$font-size--intro: 18px;
$font-size--intro--xl: 20px;
$line-height--intro: 1.6;

.intro {
  color: #4a4a4a;
  font-size: $font-size--intro;
  line-height: $line-height--intro;
  margin-bottom: 24px;
  max-width: 608px;
  @include media-breakpoint-up(md) {
    margin-bottom: 48px;
  }
  @include media-breakpoint-up(xl) {
    font-size: $font-size--intro--xl;
    margin-bottom: 60px;
    max-width: 875px;
  }

  p + p {
    margin-top: $font-size--intro * $line-height--intro;
    @include media-breakpoint-up(xl) {
      margin-top: $font-size--intro--xl * $line-height--intro;
    }
  }
}

h1 {
  font-size: 28px;
  line-height: 1.46;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: 16px;
  @include media-breakpoint-up(md) {
    margin-bottom: 20px;
  }
  @include media-breakpoint-up(xl) {
    font-size: 32px;
    letter-spacing: 1.2px;
    margin-bottom: 32px;
  }
}
</style>
