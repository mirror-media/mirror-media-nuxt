<script>
import UiH2 from './UiH2.vue'
import UiH3 from './UiH3.vue'
import UiAnnotation from './UiAnnotation.vue'
import UiFigure from './UiFigure.vue'
import UiQuoteBy from './UiQuoteBy.vue'
import UiInfobox from './UiInfobox.vue'
import UiSlideshow from '~/components/UiSlideshow.vue'
import UiSlideshowButtonPrev from '~/components/slideshow/UiSlideshowButtonPrev.vue'
import UiSlideshowButtonNext from '~/components/slideshow/UiSlideshowButtonNext.vue'
import UiStoryVideo from '~/components/UiStoryVideo.vue'
import UiEmbeddedCode from '~/components/UiEmbeddedCode.vue'
import ContainerAudioPlayer from '~/components/audio-player/ContainerAudioPlayer.vue'
import ContainerParagraphWithAnnotation from '~/components/ContainerParagraphWithAnnotation.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'

export default {
  name: 'ContentHandler',

  functional: true,

  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  render(_, { props }) {
    const { type, content: contents = [], id } = props.item
    const content = contents[0]

    if (!content) {
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

        const btnPrevClass = 'btn-prev'
        const btnNextClass = 'btn-next'

        return (
          <ClientOnly>
            <UiSlideshow
              class="slideshow"
              options={{
                navigation: {
                  prevEl: `.${btnPrevClass}`,
                  nextEl: `.${btnNextClass}`,
                },
              }}
            >
              <template slot="default">{Slides}</template>

              <UiSlideshowButtonPrev slot="btnPrev" class={btnPrevClass} />
              <UiSlideshowButtonNext slot="btnNext" class={btnNextClass} />
            </UiSlideshow>
          </ClientOnly>
        )
      }

      case 'quoteby': {
        const { quoteBy, quote = '' } = content

        return (
          <UiQuoteBy
            class="quote-by"
            quote={quote.replace(/\n/g, '<br>')}
            quoteBy={quoteBy}
          />
        )
      }

      case 'infobox':
        return (
          <UiInfobox
            class="infobox"
            title={content.title}
            content={content.body}
          />
        )

      case 'embeddedcode':
        return <UiEmbeddedCode class="embedded-code" content={content} />

      case 'audio':
        return (
          <ClientOnly>
            <ContainerAudioPlayer class="audio-player" content={content} />
          </ClientOnly>
        )

      case 'video': {
        const { url, coverPhoto = {} } = content

        return url ? (
          <LazyRenderer class="video">
            <UiStoryVideo src={url} poster={coverPhoto.mobile?.url || false} />
          </LazyRenderer>
        ) : undefined
      }

      case 'youtube': {
        const { youtubeId, description } = content

        return (
          <LazyRenderer class="youtube">
            <div class="wrapper">
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
          </LazyRenderer>
        )
      }

      case 'code-block':
        return (
          <div class="code">
            <code>{content}</code>
          </div>
        )

      case 'header-one':
        return <UiH2 id={`header-${id}`} domPropsInnerHTML={content} />

      case 'header-two':
        return <UiH3 id={`header-${id}`} domPropsInnerHTML={content} />

      case 'image': {
        const { tablet = {}, description } = content

        return <UiFigure imgUrl={tablet.url} caption={description} />
      }

      case 'blockquote':
        return <UiQuoteBy class="quote-by" quote={content} />

      case 'annotation':
        return (
          <ContainerParagraphWithAnnotation
            content={content}
            scopedSlots={{
              default: ({ data }) => (
                <UiAnnotation key={data.id} content={data} />
              ),
            }}
          />
        )

      case 'unstyled':
        return <p domPropsInnerHTML={content} />

      case 'gpt-ad': {
        const { pageKey, adKey } = content

        return (
          <ContainerGptAd class="story__ad" pageKey={pageKey} adKey={adKey} />
        )
      }

      default:
        return undefined
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
$quote-color: #4a90e2;

.article-body {
  * {
    margin: 32px 0;
  }
  h2 + *,
  h3 + * {
    margin: 12px 0 32px 0;
    @include media-breakpoint-up(md) {
      margin: 20px 0 32px 0;
    }
  }

  h2,
  h3 {
    margin: 48px 0 12px 0;
    @include media-breakpoint-up(md) {
      margin: 48px 0 20px 0;
    }
    @include media-breakpoint-up(xl) {
      font-family: inherit;
    }
    @include media-breakpoint-up(xxl) {
      margin: 48px 0 48px 0;
      text-align: center;
    }
  }

  .quote {
    max-width: 510px;
    margin: 30px auto;
  }

  .quote-icon-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 11px;

    svg {
      fill: $quote-color;
    }

    &::before,
    &::after {
      content: '';
      width: 100%;
      height: 1px;
      background-color: $quote-color;
    }

    svg {
      width: 20px;
      height: auto;
      flex-shrink: 0;
      margin-left: 33px;
      margin-right: 33px;
    }
  }

  blockquote {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.78;
    color: $quote-color;
    text-align: justify;
  }

  .embedded-code,
  .video,
  .code {
    margin-top: 20px;
  }

  .slideshow {
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
      /**
       * 為了盡可能垂直置中，減去 figcaption 最小高度的一半
       * 3.4em / 2
       */
      margin-top: -1.7em;
      @include media-breakpoint-up(lg) {
        width: 60px;
        height: 80px;

        /**
         * 為了盡可能垂直置中，減去 figcaption 最小高度的一半
         * 1.7em / 2
         */
        margin-top: -0.85em;

        &::v-deep .arrow {
          width: 28px;
        }
      }
    }

    @include media-breakpoint-up(lg) {
      .btn-prev {
        left: 0;
      }

      .btn-next {
        right: 0;
      }
    }
  }

  .infobox {
    @include media-breakpoint-up(xl) {
      width: 720px;
      position: relative;
    }
    @include media-breakpoint-up(xxl) {
      left: 0;
      margin-right: auto;
      margin-left: auto;
    }
  }

  .quote-by {
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .embedded-code ::v-deep iframe {
    max-width: 100%;
    margin-right: auto;
    margin-left: auto;
  }

  .audio-player {
    margin-top: 1em;
    margin-bottom: 1em;
    padding: 0 !important;
  }

  .youtube {
    $aspect-ratio--youtube: math.div(360, 640);

    .wrapper {
      position: relative;
      padding-top: $aspect-ratio--youtube * 100%;
    }

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
    }
  }

  .code {
    line-height: 2em;
  }

  ol {
    list-style-type: decimal;
    list-style-position: inside;
    line-height: 2;
    @include media-breakpoint-up(xxl) {
      margin-right: auto;
      margin-left: auto;
      max-width: 640px;
    }
    li {
      margin: 0;
      &::before {
        content: '';
        display: inline-block;
        margin: 0 0 0 12px;
      }
      &::marker {
        color: #054f77;
      }
    }
  }
  ul {
    list-style-type: disc;
    list-style-position: inside;
    line-height: 2;
    @include media-breakpoint-up(xxl) {
      margin-right: auto;
      margin-left: auto;
      max-width: 640px;
    }
    li {
      margin: 0;
      &::marker {
        color: #054f77;
      }
    }
  }
}
</style>
