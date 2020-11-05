<template>
  <transition v-if="shouldOpenGdpr" name="fade">
    <div class="the-gdpr">
      <div class="wrapper">
        <p>
          本網站使用相關技術提供更好的閱讀體驗，同時尊重使用者隱私，若您瀏覽此網站，即代表您同意我們使用第三方
          Cookie。若欲了解更多相關資訊，點這裡瞭解<a
            href="/story/privacy/"
            target="_blank"
            rel="noopener noreferrer"
            >隱私權聲明</a
          >。
        </p>

        <button type="button" @click="closeGdpr">我同意</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from '@nuxtjs/composition-api'
import localforage from 'localforage'

export default {
  name: 'TheGdpr',

  setup() {
    const shouldOpenGdpr = ref(false)

    localforage
      .getItem('shouldOpenGdpr')
      .then(function fulfilled(value) {
        shouldOpenGdpr.value = JSON.parse(value) ?? true
      })
      .catch(function rejected(err) {
        /* eslint-disable no-console */
        console.error(err)
        console.error(
          'Failed to get the "shouldOpenGdpr" item from storage by localForage'
        )
        /* eslint-enable no-console */
      })

    function closeGdpr() {
      shouldOpenGdpr.value = false

      localforage
        .setItem('shouldOpenGdpr', JSON.stringify(shouldOpenGdpr.value))
        .catch(function rejected(err) {
          /* eslint-disable no-console */
          console.error(err)
          console.error(
            'Failed to set the "shouldOpenGdpr" item from storage by localForage'
          )
          /* eslint-enable no-console */
        })
    }

    return {
      shouldOpenGdpr,
      closeGdpr,
    }
  },
}
</script>

<style lang="scss" scoped>
$main-color: rgb(20, 167, 208);

.the-gdpr {
  position: fixed;
  padding-left: 10px;
  padding-right: 10px;
  bottom: 10px;
  font-size: 12px;
  line-height: 1.67;
  z-index: 1049;
  color: #4a4a4a;
  text-align: justify;
  @include media-breakpoint-up(md) {
    bottom: 14px;
    width: 100%;
    max-width: 820px;
    font-size: 14px;
    line-height: 1.57;
    left: 50%;
    transform: translateX(-50%);
  }
}

.wrapper {
  background-color: #fff;
  padding: 12px 15px;
  box-shadow: 0 2px 4px rgba(#000, 0.5);
  border: 1px solid #979797;
  @include media-breakpoint-up(md) {
    padding: 9px 35px;
    display: flex;
    align-items: center;
  }
}

p {
  margin-bottom: 12px;
  @include media-breakpoint-up(md) {
    flex-grow: 1;
    margin-bottom: 0;
    margin-right: 30px;
  }
}

a {
  font-weight: 500;
  color: $main-color;
  border-bottom: 1px solid $main-color;
  cursor: pointer;
}

button {
  background-color: $main-color;
  color: #fff;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  @include media-breakpoint-up(md) {
    padding-top: 8px;
    padding-bottom: 8px;
    flex-basis: 100px;
    flex-shrink: 0;
  }

  &:hover {
    background-color: #3acdf6;
  }
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(10px);
    @include media-breakpoint-up(md) {
      transform: translate(-50%, 14px);
    }
  }
}
</style>
