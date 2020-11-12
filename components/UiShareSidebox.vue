<template>
  <div ref="shareSidebox" class="share-sidebox">
    <NuxtLink ref="logo" class="logo" to="/" @click.native="emitGa('home')">
      <picture>
        <source srcset="~/assets/mirrormedia-square.webp" type="image/webp" />
        <img
          src="~/assets/mirrormedia-square.jpg"
          alt="回到首頁"
          loading="lazy"
        />
      </picture>
    </NuxtLink>
    <a
      :href="sharedLineUrl"
      target="_blank"
      rel="noopener noreferrer"
      @click="emitGa('line')"
    >
      <SvgLineIcon class="line-icon" />
    </a>
    <a
      :href="sharedFbUrl"
      target="_blank"
      rel="noopener noreferrer"
      @click="emitGa('facebook')"
    >
      <SvgFbIcon class="fb-icon" />
    </a>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, toRef } from '@nuxtjs/composition-api'
import { useShareLine, useShareFb } from '~/composition/share.js'
import { rafWithDebounce } from '~/utils/animation.js'

import SvgLineIcon from '~/assets/line-white.svg?inline'
import SvgFbIcon from '~/assets/fb-white.svg?inline'

export default {
  name: 'UiShareSidebox',
  setup(props, { emit }) {
    const shareSidebox = useSetPosition()
    const logo = useToggleLogo()

    const sharedUrl = props.url === undefined ? undefined : toRef(props, 'url')
    const sharedLineUrl = useShareLine(sharedUrl)
    const sharedFbUrl = useShareFb(sharedUrl)

    function emitGa(name) {
      emit('sendGa', {
        eventCategory: 'article',
        eventAction: 'click',
        eventLabel: `share ${name} side`,
      })
    }

    return {
      shareSidebox,
      logo,

      sharedLineUrl,
      sharedFbUrl,

      emitGa,
    }
  },
  components: {
    SvgLineIcon,
    SvgFbIcon,
  },
  props: {
    url: {
      type: String,
      default: undefined,
    },
  },
}

function useSetPosition() {
  const shareSidebox = ref(null)
  let header, storyContainer

  onMounted(() => {
    header = document.querySelector('header')
    storyContainer = document.querySelector('.story-container')

    setPosition()

    window.addEventListener('resize', setPosition)
    window.addEventListener('orientationChange', setPosition)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', setPosition)
    window.removeEventListener('orientationChange', setPosition)
  })

  return shareSidebox

  function setPosition() {
    rafWithDebounce(() => {
      const top = header.offsetTop + header.offsetHeight
      const left = storyContainer.offsetLeft - shareSidebox.value.offsetWidth

      shareSidebox.value.style.cssText = `top: ${top}px; left: ${
        left >= 0 ? left : 0
      }px;`
    })
  }
}

function useToggleLogo() {
  const logo = ref(null)
  let headerTopLayer

  onMounted(() => {
    headerTopLayer = document.querySelector('.header-top-layer')

    window.addEventListener('scroll', toggleLogo)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', toggleLogo)
  })

  return logo

  function toggleLogo() {
    rafWithDebounce(() => {
      const { bottom } = headerTopLayer.getBoundingClientRect()
      const { $el } = logo.value

      if (bottom <= 0) {
        $el.classList.add('shown')
      } else {
        $el.classList.remove('shown')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.share-sidebox {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(#000, 0.5);
  width: 30px;
  background-color: #989898;

  a {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 0 rgba(#fff, 0.4);
    margin-bottom: 1px;

    &:hover {
      background-color: #064f77;
    }

    &:last-child,
    &.logo {
      margin-bottom: 0;
    }

    &:last-child {
      box-shadow: none;
    }
  }

  .logo {
    overflow: hidden;
    height: 0;
    opacity: 0;
    transition: height 0.3s, opacity 0.3s;

    &.shown {
      height: 30.16px;
      opacity: 1;
      margin-bottom: 1px;
    }
  }
}

svg {
  height: auto;
}

.line-icon {
  width: 24px;
}

.fb-icon {
  width: 8px;
}
</style>
