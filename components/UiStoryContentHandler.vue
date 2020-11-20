<script>
import UiSlideshow from './UiSlideshow.vue'
import UiInfobox from './UiInfobox.vue'
import UiStoryVideo from './UiStoryVideo.vue'
import ContainerAudioPlayer from './audio-player/ContainerAudioPlayer.vue'
import ContainerParagraphWithAnnotation from './ContainerParagraphWithAnnotation.vue'
import UiStoryFigure from '~/components/UiStoryFigure.vue'
import UiStoryAnnotation from '~/components/UiStoryAnnotation.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'

import SvgQuotationMark from '~/assets/quotation-mark-story.svg?inline'
import SvgArrowPrev from '~/assets/arrow-prev-slideshow.svg?inline'
import SvgArrowNext from '~/assets/arrow-next-slideshow.svg?inline'

function addExternalLinkRel(content = '') {
  return content.replace(
    'target="_blank"',
    'target="_blank" rel="noopener noreferrer"'
  )
}

function addTitleAndLazyloadToIframe(content = {}) {
  return content?.embeddedCode.replace(
    '<iframe',
    `<iframe title="${content.caption}" loading="lazy"`
  )
}

function processListItmes(content = []) {
  if (
    Array.isArray(content) &&
    content.length > 0 &&
    typeof content[0] === 'string'
  ) {
    return content
  }
  return content[0] ?? []
}

export default {
  name: 'UiStoryContentHandler',
  functional: true,
  props: {
    paragraph: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  render(_, { props }) {
    const { type, content = [], pageKey, adKey } = props.paragraph

    switch (type) {
      case 'header-one':
        return (
          <h1
            class="g-story-heading story__heading"
            domPropsInnerHTML={content[0]}
          />
        )
      case 'header-two':
        return (
          <h2
            class="g-story-heading story__heading"
            domPropsInnerHTML={content[0]}
          />
        )
      case 'image': {
        return (
          <UiStoryFigure
            class="g-story-figure story__figure"
            content={content[0] || {}}
          />
        )
      }
      case 'quoteby': {
        const quoteBy = content[0]?.quoteBy
        return (
          <div class="g-story-quote-by">
            <div
              class="g-story-quote-by__quote"
              domPropsInnerHTML={content[0]?.quote.replace(/\n/g, '<br>')}
            />
            {quoteBy ? (
              <span class="g-story-quote-by__quote-by">{quoteBy}</span>
            ) : (
              ''
            )}
          </div>
        )
      }
      case 'unordered-list-item':
      case 'ordered-list-item': {
        const isOrderedListType = type === 'ordered-list-item'
        const listTag = isOrderedListType ? 'ol' : 'ul'

        return (
          <listTag
            class={`g-story-${
              isOrderedListType ? 'ordered' : 'unordered'
            }-list`}
          >
            {processListItmes(content).map((item) => (
              <li domPropsInnerHTML={item} />
            ))}
          </listTag>
        )
      }
      case 'slideshow': {
        const Slides = content.map(function slide(item) {
          return (
            <figure key={item.id} class="swiper-slide g-story-figure">
              <img src={item.mobile.url} />
              <figcaption>{item.description}</figcaption>
            </figure>
          )
        })

        return (
          <UiSlideshow
            class="story__slideshow"
            options={{
              navigation: {
                nextEl: '.btn-next',
                prevEl: '.btn-prev',
              },
            }}
          >
            <template slot="default">{Slides}</template>

            <div slot="btnPrev" class="btn-prev">
              <SvgArrowPrev class="arrow" />
            </div>
            <div slot="btnNext" class="btn-next">
              <SvgArrowNext class="arrow" />
            </div>
          </UiSlideshow>
        )
      }
      case 'infobox':
        return <UiInfobox class="story__infobox" content={content[0]} />
      case 'embeddedcode':
        return (
          <lazy-component
            class="story__embedded-code"
            domPropsInnerHTML={addTitleAndLazyloadToIframe(content[0])}
          />
        )
      case 'audio':
        return (
          <ClientOnly>
            <ContainerAudioPlayer
              class="story__audio-player"
              content={content[0]}
            />
          </ClientOnly>
        )
      case 'video': {
        const { url } = content[0] || {}

        return url ? (
          <lazy-component>
            {/* 這裡的 class name 不能放在 <lazy-component>，如此會導致樣式吃不到。原因尚不清楚 */}
            <UiStoryVideo class="story__video" src={url} />
          </lazy-component>
        ) : undefined
      }
      case 'blockquote':
        return (
          <blockquote class="story__blockquote">
            <SvgQuotationMark />
            <div domPropsInnerHTML={content[0]} />
          </blockquote>
        )
      case 'annotation':
        return (
          <ContainerParagraphWithAnnotation
            class="g-story-paragraph"
            content={content[0] || ''}
            scopedSlots={{
              default: ({ data }) => (
                <UiStoryAnnotation key={data.id} content={data} />
              ),
            }}
          />
        )
      case 'youtube': {
        const { youtubeId, description } = content[0] || {}

        return (
          <ClientOnly>
            <lazy-component class="story__youtube">
              <div class="youtube-wrapper">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture"
                  allowfullscreen
                />
              </div>

              {description && <p class="g-story-caption">{description}</p>}
            </lazy-component>
          </ClientOnly>
        )
      }
      case 'gpt-ad':
        return (
          <ClientOnly>
            <ContainerGptAd class="story__ad" pageKey={pageKey} adKey={adKey} />
          </ClientOnly>
        )
      case 'code-block':
        return (
          <div class="story__code">
            <code>{content[0] ?? ''}</code>
          </div>
        )
      case 'unstyled':
        return (
          <p
            class="g-story-paragraph"
            domPropsInnerHTML={addExternalLinkRel(content[0])}
          />
        )
      default:
        return undefined
    }
  },
}
</script>

<style lang="scss" scoped>
.story {
  &__slideshow {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    text-align: center;

    .swiper-slide {
      img,
      figcaption {
        margin-left: auto;
        margin-right: auto;
      }

      img {
        width: calc(100% - 104px);
        max-height: 450px;
        object-fit: contain;
        @include media-breakpoint-up(md) {
          width: calc(100% - 120px);
        }
        @include media-breakpoint-up(lg) {
          width: calc(100% - 152px);
        }
      }

      figcaption {
        width: 70%;
        // 1em * 1.7 (line-height) * 2 (行數)
        min-height: 3.4em;

        @include media-breakpoint-up(lg) {
          // 1em * 1.7 (line-height)
          min-height: 1.7em;
        }
      }
    }

    .btn-prev,
    .btn-next {
      width: 30px;
      height: 40px;
      background-color: rgba(245, 245, 245, 0.25);
      border-radius: 4px;
      position: absolute;
      z-index: 10;
      top: 50%;
      transform: translateY(-50%);
      // 為了盡可能垂直置中，減去 figcaption 最小高度的一半
      // 3.4em / 2
      margin-top: -1.7em;

      display: flex;
      justify-content: center;
      align-items: center;
      outline: none;
      @include media-breakpoint-up(lg) {
        width: 60px;
        height: 80px;
        // 為了盡可能垂直置中，減去 figcaption 最小高度的一半
        // 1.7em / 2
        margin-top: -0.85em;
      }

      &:hover {
        background-color: #084f77;

        .arrow {
          fill: #fff;
        }
      }
    }

    .btn-prev {
      left: 5px;
      @include media-breakpoint-up(lg) {
        left: 0;
      }

      .arrow {
        transform: translateX(-1px);
      }
    }

    .btn-next {
      right: 5px;
      @include media-breakpoint-up(lg) {
        right: 0;
      }

      .arrow {
        transform: translateX(1px);
      }
    }

    .arrow {
      width: 15px;
      height: auto;
      @include media-breakpoint-up(lg) {
        width: 28px;
      }
    }
  }

  &__infobox {
    margin-top: 3em;
    margin-bottom: 3em;
  }

  &__audio-player {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  &__video {
    margin-top: 20px;
  }

  &__youtube {
    margin-top: 20px;

    .youtube-wrapper {
      position: relative;
      padding-top: 56.25%; // 315 / 560 * 100%
    }

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
