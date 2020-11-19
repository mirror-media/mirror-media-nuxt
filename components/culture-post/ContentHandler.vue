<script>
import UiAnnotation from './UiAnnotation.vue'
import ContainerParagraphWithAnnotation from '~/components/ContainerParagraphWithAnnotation.vue'

import SvgQuotationMark from '~/assets/quotation-mark-culture-post.svg?inline'

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
}
</style>
