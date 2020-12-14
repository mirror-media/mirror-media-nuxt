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
    const { type } = props.paragraph

    // 不需要 contents 的 type
    if (type === 'gpt-ad') {
      const { pageKey, adKey } = props.paragraph

      return (
        <ClientOnly>
          <ContainerGptAd class="story__ad" pageKey={pageKey} adKey={adKey} />
        </ClientOnly>
      )
    }

    // 需要 contents 或 contents[0] 的 type
    {
      const { content: contents = [] } = props.paragraph

      // 需要 contents 的 type
      if (contents.length <= 0) {
        return undefined
      }

      switch (type) {
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
              {processListItmes(contents).map((item) => (
                <li domPropsInnerHTML={item} />
              ))}
            </listTag>
          )
        }

        case 'slideshow': {
          const Slides = contents.map(function slide(item) {
            return (
              <figure key={item.id} class="swiper-slide g-story-figure">
                <img src={item.mobile.url} />
                <figcaption>{item.description}</figcaption>
              </figure>
            )
          })

          return (
            <ClientOnly>
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
            </ClientOnly>
          )
        }
      }

      // 只需要 contents[0] 的 type
      {
        const [content] = contents

        if (!content) {
          return undefined
        }

        switch (type) {
          case 'header-one':
            return (
              <h1
                class="g-story-heading story__heading"
                domPropsInnerHTML={content}
              />
            )

          case 'header-two':
            return (
              <h2
                class="g-story-heading story__heading"
                domPropsInnerHTML={content}
              />
            )

          case 'image': {
            return (
              <UiStoryFigure
                class="g-story-figure story__figure"
                content={content}
              />
            )
          }

          case 'quoteby': {
            const { quoteBy, quote = '' } = content

            return (
              <div class="g-story-quote-by">
                <div
                  class="g-story-quote-by__quote"
                  domPropsInnerHTML={quote.replace(/\n/g, '<br>')}
                />
                {quoteBy ? (
                  <span class="g-story-quote-by__quote-by">{quoteBy}</span>
                ) : (
                  ''
                )}
              </div>
            )
          }

          case 'infobox':
            return <UiInfobox class="story__infobox" content={content} />

          case 'embeddedcode':
            return (
              <div
                class="story__embedded-code"
                domPropsInnerHTML={content.embeddedCode}
              ></div>
            )

          case 'audio':
            return (
              <ClientOnly>
                <ContainerAudioPlayer
                  class="story__audio-player"
                  content={content}
                />
              </ClientOnly>
            )

          case 'video': {
            const { url, coverPhoto = {} } = content

            return url ? (
              <LazyRenderer class="story__video">
                <UiStoryVideo
                  src={url}
                  poster={coverPhoto.mobile?.url || false}
                />
              </LazyRenderer>
            ) : undefined
          }

          case 'blockquote':
            return (
              <blockquote class="story__blockquote">
                <SvgQuotationMark />
                <div domPropsInnerHTML={content} />
              </blockquote>
            )

          case 'annotation':
            return (
              <ContainerParagraphWithAnnotation
                class="g-story-paragraph"
                content={content}
                scopedSlots={{
                  default: ({ data }) => (
                    <UiStoryAnnotation key={data.id} content={data} />
                  ),
                }}
              />
            )

          case 'youtube': {
            const { youtubeId, description } = content

            return (
              <LazyRenderer class="story__youtube">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture"
                  allowfullscreen
                />

                {description && <p class="g-story-caption">{description}</p>}
              </LazyRenderer>
            )
          }

          case 'code-block':
            return (
              <div class="story__code">
                <code>{content}</code>
              </div>
            )

          case 'unstyled':
            return (
              <p
                class="g-story-paragraph"
                domPropsInnerHTML={addRelToExternalLink(content)}
              />
            )
        }
      }
    }

    return undefined

    function addRelToExternalLink(content = '') {
      return content.replace(
        'target="_blank"',
        'target="_blank" rel="noopener noreferrer"'
      )
    }

    function processListItmes(contents = []) {
      if (!Array.isArray(contents)) {
        return []
      }

      if (typeof contents[0] !== 'string') {
        const [nestedContents] = contents

        return Array.isArray(nestedContents) ? nestedContents : []
      }

      return contents
    }
  },
}
</script>

<style lang="scss" scoped>
.story {
  &__figure,
  &__embedded-code,
  &__video,
  &__youtube,
  &__code {
    margin-top: 20px;
  }

  &__blockquote,
  &__infobox {
    margin-top: 3em;
    margin-bottom: 3em;
  }

  &__heading {
    margin-top: 40px;
  }

  &__blockquote {
    display: flex;
    align-items: flex-start;
    color: #3a759e;
    font-size: 19px;
    line-height: 1.77;
    @include media-breakpoint-up(xl) {
      line-height: 1.85;
    }

    svg {
      fill: #064f77;
      width: 40px;
      height: auto;
      flex-shrink: 0;
      margin-right: 20px;
      @include media-breakpoint-up(xl) {
        width: 45px;
      }
    }
  }

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
        @include media-breakpoint-up(xl) {
          width: calc(100% - 152px);
        }
      }

      figcaption {
        width: 70%;
        // 1em * 1.7 (line-height) * 2 (行數)
        min-height: 3.4em;

        @include media-breakpoint-up(xl) {
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
      z-index: 9;
      top: 50%;
      transform: translateY(-50%);
      // 為了盡可能垂直置中，減去 figcaption 最小高度的一半
      // 3.4em / 2
      margin-top: -1.7em;

      display: flex;
      justify-content: center;
      align-items: center;
      outline: none;
      @include media-breakpoint-up(xl) {
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
      @include media-breakpoint-up(xl) {
        left: 0;
      }

      .arrow {
        transform: translateX(-1px);
      }
    }

    .btn-next {
      right: 5px;
      @include media-breakpoint-up(xl) {
        right: 0;
      }

      .arrow {
        transform: translateX(1px);
      }
    }

    .arrow {
      width: 15px;
      height: auto;
      @include media-breakpoint-up(xl) {
        width: 28px;
      }
    }
  }

  &__audio-player {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  &__embedded-code::v-deep iframe {
    max-width: 100%;
    margin-right: auto;
    margin-left: auto;
  }

  &__code {
    line-height: 2em;
  }

  &__youtube {
    position: relative;
    padding-top: 56.25%; // 315 / 560 * 100%

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
