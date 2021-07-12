<template>
  <div class="subscribe-info">
    <h2>注意事項</h2>
    <ul>
      <li v-for="info in infoList" :key="info.id">
        <p>{{ info.text }}</p>
        <p
          v-for="infoChild in infoSubList(info)"
          :key="infoChild.id"
          class="subscribe-info__sub"
        >
          {{ infoChild.text }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      infoList: [
        {
          id: 0,
          text: '完成訂購後，開始寄送期數將由服務人員提供。',
        },
        {
          id: 1,
          text:
            '雜誌每週三出刊，將於週四(含)前完成寄送，若當週五仍未收到，請來電 02-6633-3882 查詢。',
        },
        {
          id: 2,
          text: '若需更址，請於週四中午 12:00 前來電，我們將於下週寄送新址。',
        },
        {
          id: 3,
          text: '雜誌如有下列情事者，同意訂戶退貨： ',
          child: [
            {
              id: 0,
              text:
                '訂戶可依消費者保護法規定得於完成付款日起算七天猶豫期內主張退貨且可獲全額退款，如已開始配送，其處理說明如下：',
            },
            {
              id: 1,
              text: '(1) 訂戶需支付作業手續費用。',
            },
            {
              id: 2,
              text: '(2) 贈送的期數將不列入計算。',
            },
          ],
        },
      ],
    }
  },
  methods: {
    infoSubList(info) {
      return info.child ? info.child : []
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-info {
  max-width: 940px;
  margin: auto;
  padding: 0 17px;

  h2 {
    font-size: 22px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #4a4a4a;
    margin-bottom: 13px;

    @include media-breakpoint-up(sm) {
      font-size: 26px;
    }
  }
  ul {
    list-style: disc;
    margin-left: 1rem;

    li {
      max-width: 940px;
      margin: auto;
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2;
      letter-spacing: normal;
      color: #4a4a4a;
      .subscribe-info__sub {
        margin-left: 8px;
      }
    }
  }
}
</style>
