<template>
  <div class="referendum">
    <div class="referendum__title">
      <div class="referendum__title_main">
        <div class="referendum__title_main_title">公投開票進度</div>
        <div class="referendum__title_main_note">
          <span class="agree">同意</span>
          <span class="disagree">不同意</span>
        </div>
      </div>
      <div class="referendum__title_info">
        <div>最後更新時間：{{ formateDate(updateTime) }}</div>
      </div>
    </div>
    <div class="referendum__info">
      <ReferendumItem
        v-if="data.F1"
        number="17"
        name="重啟核四"
        :data="data.F1"
        :threhold="threhold"
      />
      <ReferendumItem
        v-if="data.F2"
        number="18"
        name="反萊豬進口"
        :data="data.F2"
        :threhold="threhold"
      />
      <ReferendumItem
        v-if="data.F3"
        number="19"
        name="公投綁大選"
        :data="data.F3"
        :threhold="threhold"
      />
      <ReferendumItem
        v-if="data.F4"
        number="20"
        name="珍愛藻礁"
        :data="data.F4"
        :threhold="threhold"
      />
    </div>
    <div class="referendum__title_info rwd">
      <div>最後更新時間：{{ formateDate(updateTime) }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ReferendumItem from '~/components/ReferendumItem.vue'
export default {
  layout: 'empty',
  components: {
    ReferendumItem,
  },
  data() {
    return {
      updateTime: new Date(),
      threhold: 4980000,
      data: {},
    }
  },
  mounted() {
    this.updateJson()
    setInterval(() => this.updateJson(), 60000)
  },
  methods: {
    formateDate(time) {
      const formattedDate =
        time.getFullYear() +
        '/' +
        (time.getMonth() + 1) +
        '/' +
        time.getDate() +
        ' ' +
        this.formateDigits(time.getHours()) +
        ':' +
        this.formateDigits(time.getMinutes())
      return formattedDate
    },
    formateDigits(input) {
      const string = input + ''
      if (string.length === 2) return string
      return '0' + string
    },
    async updateJson() {
      try {
        const { data = [] } = await axios.get(
          'https://storage.googleapis.com/statics.mirrormedia.mg/elections/2021referendum/result.json'
        )
        this.updateTime = new Date()
        this.data.ST = data.ST
        this.updateData(data.F1, 'F1')
        this.updateData(data.F2, 'F2')
        this.updateData(data.F3, 'F3')
        this.updateData(data.F4, 'F4')
      } catch (e) {
        console.error(e)
      }
    },
    updateData(data, key) {
      const agreeTks = data.agreeTks || this.data.agreeTks
      const agreeRate = data.agreeRate || this.data.agreeRate
      const disagreeTks = data.disagreeTks || this.data.disagreeTks
      const disagreeRate = data.disagreeRate || this.data.disagreeRate
      const adptVictor = data.adptVictor || this.data.adptVictor
      const prgRate = data.prgRate || this.data.prgRate
      if (
        !agreeTks ||
        !agreeRate ||
        !disagreeTks ||
        !disagreeRate ||
        !adptVictor ||
        !prgRate
      )
        return {}
      this.data[`${key}`] = {
        agreeTks,
        agreeRate,
        disagreeTks,
        disagreeRate,
        adptVictor,
        prgRate,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$agree-color: #009045;
$disagree-color: #e51731;

.referendum {
  padding: 16px 24px;
  background: #f3f5f7;
  max-width: 704px;
  margin: 0 auto;
  @include media-breakpoint-up(xl) {
    max-width: 970px;
  }

  &__title {
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    &_main {
      display: flex;
      justify-content: space-between;
      width: 100%;
      @include media-breakpoint-up(md) {
        justify-content: flex-start;
        width: fit-content;
      }
      &_title {
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: #4a4a4a;
        margin-right: 24px;
        @include media-breakpoint-up(md) {
          font-size: 18px;
          line-height: 25px;
        }
      }
      &_note {
        font-size: 13px;
        line-height: 18px;
        color: #4a4a4a;
        @include media-breakpoint-up(md) {
          font-size: 16px;
          line-height: 22px;
        }
        span:before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 4px;
          @include media-breakpoint-up(md) {
            width: 12px;
            height: 12px;
          }
        }
        .agree:before {
          background: $agree-color;
        }
        .disagree:before {
          background: $disagree-color;
        }
        span + span {
          margin-left: 12px;
        }
      }
    }
    &_info {
      display: none;
      @include media-breakpoint-up(md) {
        display: block;
        font-size: 13px;
        line-height: 18px;
        color: #9b9b9b;
      }
    }
  }

  &__info {
    display: flex;
    flex-wrap: wrap;
  }

  .rwd {
    display: block;
    font-size: 13px;
    line-height: 18px;
    color: #9b9b9b;
    margin-top: 12px;
    @include media-breakpoint-up(md) {
      display: none;
    }
  }
}
</style>
