<script>
import UIInfobox from './UIInfobox.vue'
import ContainerAudioPlayer from './audio-player/ContainerAudioPlayer.vue'

function addTitleAndLazyloadToIframe(content = {}) {
  return content?.embeddedCode.replace(
    '<iframe',
    `<iframe title="${content.caption}" loading="lazy"`
  )
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
          <picture class="g-story-picture">
            <img v-lazy={paragraph.content[0]?.mobile?.url} alt={description} />
            <figcaption>{description}</figcaption>
          </picture>
        )
      }
      case 'quoteby':
        return (
          <div
            class="g-story-quote-by"
            domPropsInnerHTML={paragraph.content[0]?.quote.replace(
              /\n/g,
              '<br>'
            )}
          />
        )
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
            {paragraph.content[0].map((item) => (
              <li domPropsInnerHTML={item} />
            ))}
          </listTag>
        )
      }
      case 'infobox':
        return <UIInfobox content={paragraph.content[0]} />
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
            <ContainerAudioPlayer content={paragraph.content[0]} />
          </ClientOnly>
        )
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
            domPropsInnerHTML={paragraph.content[0]}
          />
        )
      default:
        return undefined
    }
  },
}
</script>

<style lang="scss" scoped>
.audio-player {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
