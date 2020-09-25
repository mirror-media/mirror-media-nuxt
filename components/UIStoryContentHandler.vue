<script>
import UIInfobox from './UIInfobox.vue'
import UIStoryVideo from './UIStoryVideo.vue'
import ContainerAudioPlayer from './audio-player/ContainerAudioPlayer.vue'

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
  name: 'UIStoryContentHandler',
  functional: true,
  components: {
    UIInfobox,
    ContainerAudioPlayer,
  },
  props: {
    paragraph: {
      type: Object,
      required: true,
    },
  },
  render(h, { props }) {
    const paragraph = props.paragraph
    switch (paragraph.type) {
      case 'header-one':
        return (
          <h1
            class="g-story-heading story__heading"
            domPropsInnerHTML={paragraph.content[0]}
          />
        )
      case 'header-two':
        return (
          <h2
            class="g-story-heading story__heading"
            domPropsInnerHTML={paragraph.content[0]}
          />
        )
      case 'image': {
        const description = paragraph.content[0].description
        return (
          <figure class="g-story-figure">
            <img v-lazy={paragraph.content[0]?.mobile?.url} alt={description} />
            <figcaption>{description}</figcaption>
          </figure>
        )
      }
      case 'quoteby': {
        const quoteBy = paragraph.content[0]?.quoteBy
        return (
          <div class="g-story-quote-by">
            <div
              class="g-story-quote-by__quote"
              domPropsInnerHTML={paragraph.content[0]?.quote.replace(
                /\n/g,
                '<br>'
              )}
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
        const isOrderedListType = paragraph.type === 'ordered-list-item'
        const listTag = isOrderedListType ? 'ol' : 'ul'

        return (
          <listTag
            class={`g-story-${
              isOrderedListType ? 'ordered' : 'unordered'
            }-list`}
          >
            {processListItmes(paragraph.content).map((item) => (
              <li domPropsInnerHTML={item} />
            ))}
          </listTag>
        )
      }
      case 'infobox':
        return (
          <UIInfobox class="story__infobox" content={paragraph.content[0]} />
        )
      case 'embeddedcode':
        return (
          <lazy-component
            class="story__embedded-code"
            domPropsInnerHTML={addTitleAndLazyloadToIframe(
              paragraph.content[0]
            )}
          />
        )
      case 'audio':
        return (
          <ClientOnly>
            <ContainerAudioPlayer
              class="story__audio-player"
              content={paragraph.content[0]}
            />
          </ClientOnly>
        )
      case 'video':
        return <UIStoryVideo video={paragraph.content[0]} />
      case 'blockquote':
        return (
          <blockquote
            class="story-blockquote"
            domPropsInnerHTML={paragraph.content[0]}
          />
        )
      case 'unstyled':
        return (
          <p
            class="g-story-paragraph"
            domPropsInnerHTML={addExternalLinkRel(paragraph.content[0])}
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
  &__infobox {
    margin-top: 48px;
    margin-bottom: 48px;
  }

  &__audio-player {
    margin-top: 16px;
    margin-bottom: 16px;
  }
}
</style>
