<template>
  <div class="article-info">
    <div class="article-info__info info">
      <div class="info__time time">
        <p>發布時間 {{ publishTimeFormat }}</p>
        <p class="time__update-time">更新時間 {{ updateTimeFormat }}</p>
      </div>
      <div
        v-if="writers.length || photographers.length || extendByline"
        class="info__people people"
      >
        <p v-if="writers.length" class="people__writers">
          <span>記者｜</span>
          <UiLink
            v-for="writer in writers"
            :key="writer.id"
            class="link"
            :href="`/author/${writer.id}`"
            target="_blank"
            rel="noreferrer noopener"
          >
            {{ writer.name }}
          </UiLink>
        </p>
        <p v-show="extendByline" class="people__extendByline">
          <span>{{ extendByline }}</span>
        </p>
        <p v-if="photographers.length" class="people__photographers">
          <span>攝影｜</span>
          <UiLink
            v-for="photographer in photographers"
            :key="photographer.id"
            class="link"
            :href="`/author/${photographer.id}`"
            target="_blank"
            rel="noreferrer noopener"
          >
            {{ photographer.name }}
          </UiLink>
        </p>
      </div>
      <div v-if="tags.length" class="info__tags tags">
        <UiTag
          v-for="tag in tags"
          :key="tag.id"
          class="tags__tag tag"
          :href="`/tag/${tag.id}`"
          target="_blank"
          rel="noreferrer noopener"
        >
          {{ tag.name }}
        </UiTag>
      </div>
    </div>
    <div class="article-info__share-links-wrapper share-links-wrapper">
      <UiShareFb class="share-link" />
      <UiShareLine class="share-link" />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import UiLink from '~/components/culture-post-for-premium/UiLink.vue'
import UiTag from '~/components/culture-post-for-premium/UiTag.vue'
import UiShareFb from '~/components/UiShareFb.vue'
import UiShareLine from '~/components/UiShareLine.vue'

export default {
  components: { UiShareLine, UiShareFb, UiTag, UiLink },
  props: {
    publishTime: {
      type: Date,
      default: new Date(),
    },
    updateTime: {
      type: Date,
      default: new Date(),
    },
    writers: {
      type: Array,
      default: () => [],
    },
    extendByline: {
      type: String,
      default: '',
    },
    photographers: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    publishTimeFormat() {
      return this.formatTime(this.publishTime)
    },
    updateTimeFormat() {
      return this.formatTime(this.updateTime)
    },
  },
  methods: {
    formatTime(time = new Date()) {
      return dayjs(time).format('YYYY.MM.DD HH:mm')
    },
  },
}
</script>

<style lang="scss" scoped>
.article-info {
  border-left: 2px solid #054f77;
  padding: 4px 0 4px 24px;
  font-size: 14px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    flex-direction: row;
  }

  &__share-links-wrapper {
    margin: 20px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 0;
    }
  }
}

.info {
  width: 100%;
  &__people {
    margin: 20px 0 0 0;
  }
}

.time {
  &__update-time {
    margin: 8px 0 0 0;
  }
}

.people {
  font-size: 16px;
  line-height: 1.6;
  & p + p {
    margin: 8px 0 0 0;
  }
}

.tags {
  margin: 12px 0 0 -8px;
  &__tag {
    margin: 8px 0 0 8px;
  }
}

.share-links-wrapper {
  min-width: 84px;
  width: 84px;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.share-link {
  display: inline-block;
  width: 36px;
  height: 36px;
}

.link {
  & + & {
    &:before {
      content: '•';
      color: #c4c4c4;
      margin: 0 4px;
    }
  }
}
</style>
