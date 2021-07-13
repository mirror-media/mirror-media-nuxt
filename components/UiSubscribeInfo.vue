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
          text:
            '若需更改收件地址，請於每週四中午 12:00 前來電，我們將於下週寄送至新址。',
        },
        {
          id: 3,
          text:
            '訂單成立後，會收到我們 email 給您的確認信。手機號碼及電子信箱請務必正確填寫。',
        },
        {
          id: 4,
          text: '雜誌的取消/退訂注意事項',
          child: [
            {
              id: 0,
              text:
                '雜誌未配送前可全額退款。雜誌如已開始配送，退費金額=原訂金額-(零售價 $75 x 訂閱已配送期數)-原訂金額之 5% 手續費',
            },
            {
              id: 1,
              text: '註1：訂閱已配送期數包含已進入配送作業流程的期數。',
            },
            {
              id: 2,
              text: '如有疑問請來電 02-6633-3882 詢問。',
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
