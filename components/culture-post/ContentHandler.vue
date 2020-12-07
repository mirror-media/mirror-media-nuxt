<script>
import UiAnnotation from './UiAnnotation.vue'
import UiInfobox from '~/components/UiInfobox.vue'
import UiSlideshow from '~/components/UiSlideshow.vue'
import UiStoryVideo from '~/components/UiStoryVideo.vue'
import ContainerAudioPlayer from '~/components/audio-player/ContainerAudioPlayer.vue'
import ContainerParagraphWithAnnotation from '~/components/ContainerParagraphWithAnnotation.vue'

import SvgQuotationMark from '~/assets/quotation-mark-culture-post.svg?inline'
import SvgArrowPrev from '~/assets/arrow-prev-slideshow.svg?inline'
import SvgArrowNext from '~/assets/arrow-next-slideshow.svg?inline'

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

        return (
          <ClientOnly>
            <UiSlideshow
              class="slideshow"
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

      case 'quoteby': {
        const { quoteBy, quote = '' } = content

        return (
          <div class="g-story-quote-by quote-by">
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
        return <UiInfobox class="infobox" content={content} />

      case 'embeddedcode':
        return (
          <LazyRenderer class="embedded-code">
            <div
              class="embedded-code"
              domPropsInnerHTML={addTitleAndLazyloadToIframe(content)}
            ></div>
          </LazyRenderer>
        )

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
          <div class="code">
            <code>{content}</code>
          </div>
        )

      case 'header-one':
        return <h2 id={`header-${id}`} domPropsInnerHTML={content} />

      case 'header-two':
        return <h3 domPropsInnerHTML={content} />

      case 'image': {
        const { alignment, tablet = {}, description } = content

        return (
          // eslint-disable-next-line lines-around-comment
          // 不需要 'center' 來判斷樣式，故排除
          <figure class={alignment !== 'center' && alignment}>
            <img v-lazy={tablet.url} alt="" />

            {description && <figcaption>{description}</figcaption>}
          </figure>
        )
      }

      case 'blockquote':
        return (
          <div class="quote">
            <div class="quote-icon-wrapper">
              <SvgQuotationMark />
            </div>

            <blockquote domPropsInnerHTML={content}></blockquote>
          </div>
        )

      case 'annotation':
        return (
          <ContainerParagraphWithAnnotation
            class="g-story-paragraph"
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

      default:
        return undefined
    }

    function addTitleAndLazyloadToIframe(content = {}) {
      return content.embeddedCode.replace(
        '<iframe',
        `<iframe title="${content.caption}" loading="lazy"`
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
$quote-color: #4a90e2;

.article-body {
  h2,
  h3 {
    font-family: source-han-serif-tc, 'Songti TC', serif;
    font-weight: 700;
    line-height: 1.5;
    margin-top: 60px;
  }

  h2 {
    font-size: 28px;
    @include media-breakpoint-up(lg) {
      font-size: 30px;
    }
  }

  h3 {
    font-size: 18px;
  }

  figure {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    @include media-breakpoint-up(md) {
      &.left,
      &.right {
        clear: both;
        width: 300px;
        margin-bottom: 35px;

        figcaption {
          margin-left: 0;
          margin-right: 0;
        }
      }

      &.left {
        float: left;
        margin-right: 35px;
        padding-left: 33px;
      }

      &.right {
        float: right;
        margin-left: 35px;
        padding-right: 33px;
      }
    }

    img {
      width: 100%;
      border-radius: 4px;
    }

    figcaption {
      padding-top: 10px;
      margin-top: 12px;
      margin-left: 17px;
      margin-right: 17px;
      color: rgba(#000, 0.66);
      font-size: 13px;
      line-height: 1.5;
      letter-spacing: 1px;
      border-top: 1px solid #979797;
      @include media-breakpoint-up(lg) {
        margin-top: 16px;
        margin-left: 33px;
        margin-right: 33px;
      }
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
  .youtube,
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

  .infobox {
    margin-top: 3em;
    margin-bottom: 3em;
    padding: 0 18px !important;
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

  .quote-by {
    margin-top: 80px;
  }

  .youtube {
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

  .code {
    line-height: 2em;
  }
}
</style>
