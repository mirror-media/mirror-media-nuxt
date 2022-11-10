<template>
  <div class="footerWrapper">
    <div class="date-source">
      <p>最後更新時間：{{ formattedDate }}</p>
      <p>資料來源：中央選舉委員會</p>
    </div>
    <a class="link" href="">完整開票內容</a>
  </div>
</template>

<script>
export default {
  name: 'ElectionFooter',
  props: {
    updatedAt: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
  data() {
    return {
      name: 'bibo',
    }
  },
  computed: {
    formattedDate() {
      return this.updatedAt.slice(0, -3).replace('-', '/').replace('-', '/')
    },
  },
}
</script>

<style lang="scss" scoped>
.footerWrapper {
  height: 125px;
  padding: 8px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  font-size: 13px;
  color: #9b9b9b;

  @include media-breakpoint-up(md) {
    height: 60px;
    justify-content: space-between;
    flex-direction: row;
    align-items: flex-end;
    width: 668px;
  }
  @include media-breakpoint-up(xl) {
    height: 60px;
    width: 922px;
  }
  .link {
    color: #4a4a4a;
    font-size: 14px;
    text-decoration-line: underline;
    font-weight: 600;
    padding-top: 8px;
    padding-left: 38%;
  }
  .date-source {
    display: flex;
    flex-direction: column;
  }
}
</style>
