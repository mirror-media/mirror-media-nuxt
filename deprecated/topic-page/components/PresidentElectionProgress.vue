<template>
  <section class="candidate-progress">
    <div
      v-for="(event, idx) in events"
      :key="event.id"
      ref="event"
      class="candidate-progress__event"
      :style="{ zIndex: 8 - idx }"
      :class="{ active: activeIdx === idx }"
    >
      <div class="candidate-progress__date">
        {{ event.date }}
      </div>
      <div class="candidate-progress__name">
        {{ event.name }}
      </div>
    </div>
  </section>
</template>

<script>
import smoothscroll from 'smoothscroll-polyfill'

if (typeof window !== 'undefined') {
  smoothscroll.polyfill()
}

export default {
  name: 'PresidentElectionProgress',
  data() {
    return {
      events: [
        {
          id: 1,
          name: '受理申請為總統、副總統選舉被連署人',
          date: '2019 年 9 月 13 日 ~ 9 月 17 日',
          time: new Date('2019-09-12T16:00:00.000Z').getTime(),
        },
        {
          id: 2,
          name: '中選會公告總統、副總統選舉被連署人',
          date: '2019 年 9 月 18 日',
          time: new Date('2019-09-17T16:00:00.000Z').getTime(),
        },
        {
          id: 3,
          name: '中選會受理總統、副總統選舉連署書件',
          date: '2019 年 9 月 19 日 ~ 11 月 2 日',
          time: new Date('2019-09-18T16:00:00.000Z').getTime(),
        },
        {
          id: 4,
          name: '中選會公告總統、副總統選舉連署結果',
          date: '2019 年 11 月 13 日前',
          time: new Date('2019-11-02T16:00:00.000Z').getTime(),
        },
        {
          id: 5,
          name: '總統、副總統選舉參選人登記申請',
          date: '2019 年 11 月 18 日 ~ 11 月 22 日',
          time: new Date('2019-11-13T16:00:00.000Z').getTime(),
        },
        {
          id: 6,
          name: '總統、副總統選舉候選人抽籤決定號次',
          date: '2019 年 12 月 9 日',
          time: new Date('2019-11-22T16:00:00.000Z').getTime(),
        },
        {
          id: 7,
          name: '總統、副總統選舉候選人電視政見發表會',
          date: '2019 年 12 月 14 日 ~ 2020 年 1 月 10 日',
          time: new Date('2019-12-09T16:00:00.000Z').getTime(),
        },
        {
          id: 8,
          name: '投票、開票',
          date: '2020 年 1 月 11 日',
          time: new Date('2020-01-10T16:00:00.000Z').getTime(),
        },
      ],
      activeIdx: -1,
    }
  },
  mounted() {
    const now = new Date().getTime()
    for (let i = 0; i < this.events.length; i += 1) {
      if (i === 0) {
        if (now < this.events[1].time) {
          this.$el.scroll({ top: 0, left: 14 })
          this.activeIdx = 0
          return
        }
      } else if (i === 7) {
        if (now >= this.events[7].time) {
          const elLeft = this.$refs.event[7].offsetLeft
          this.$el.scroll({ top: 0, left: elLeft + 14 })
          this.activeIdx = 7
          return
        }
      } else if (now >= this.events[i].time && now < this.events[i + 1].time) {
        const elLeft = this.$refs.event[i].offsetLeft
        this.$el.scroll({ top: 0, left: 14 + elLeft })
        this.activeIdx = i
        return
      }
    }
  },
}
</script>

<style lang="stylus">
.candidate-progress
  display flex
  margin-bottom 15px
  overflow-y scroll
  // &::-webkit-scrollbar
  //   display none
  &__event
    flex 0 0 auto
    font-size 15px
    &:not(:last-child)
      margin-right 4px
    &.active
      & .candidate-progress__name
        background-color #074f77
        font-weight 600
        &:before
          border-left-color #074f77
  &__date
    color #4a4a4a
    padding-left 26px
    margin-bottom 10px
    line-height 1
    @media (min-width 768px)
      margin-bottom 8px
  &__name
    position relative
    height 40px
    line-height 40px
    color #fff
    background-color #9b9b9b
    padding-right 6px
    padding-left 26px
    @media (min-width 768px)
      font-size 18px
      height 48px
      line-height 48px
      padding-right 11px
      padding-left 29px
    &:before, &:after
      content ''
      position absolute
      width 0
      height 0
      top 0
      border-top 20px solid transparent
      border-bottom 20px solid transparent
      @media (min-width 768px)
        border-top-width 24px
        border-bottom-width 24px
    &:before
      right -14px
      border-left 14px solid #9b9b9b
    &:after
      left 0
      border-left 14px solid #f2f2f2
</style>
