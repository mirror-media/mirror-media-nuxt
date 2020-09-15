<script>
import UIInfobox from './UIInfobox.vue'

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
          <h1 class="story-heading" domPropsInnerHTML={paragraph.content[0]} />
        )
      case 'header-two':
        return (
          <h2 class="story-heading" domPropsInnerHTML={paragraph.content[0]} />
        )
      case 'image': {
        const description = paragraph.content[0].description
        return (
          <picture class="story-picture">
            <img v-lazy={paragraph.content[0]?.mobile?.url} alt={description} />
            <figcaption>{description}</figcaption>
          </picture>
        )
      }
      case 'quoteby':
        return (
          <div
            class="story-quote-by"
            domPropsInnerHTML={paragraph.content[0]?.quote.replace(
              /\n/g,
              '<br>'
            )}
          />
        )
      case 'unordered-list-item':
      case 'ordered-list-item': {
        const customTag = paragraph.type === 'ordered-list-item' ? 'ol' : 'ul'
        return (
          <customTag class="story-list">
            {paragraph.content[0].map((item) => (
              <li domPropsInnerHTML={item} />
            ))}
          </customTag>
        )
      }
      case 'infobox':
        return <UIInfobox content={paragraph.content[0]} />
      case 'embeddedcode':
        return (
          <lazy-component
            class="story-embedded-code"
            domPropsInnerHTML={addTitleAndLazyloadToIframe(
              paragraph.content[0]
            )}
          />
        )
      case 'unstyled':
        return (
          <p class="story-paragraph" domPropsInnerHTML={paragraph.content[0]} />
        )
      default:
        return undefined
    }
  },
}
</script>
