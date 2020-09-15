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
        return <h1 domPropsInnerHTML={paragraph.content[0]} />
      case 'header-two':
        return <h2 domPropsInnerHTML={paragraph.content[0]} />
      case 'image': {
        const description = paragraph.content[0].description
        return (
          <picture>
            <img v-lazy={paragraph.content[0]?.mobile?.url} alt={description} />
            <figcaption>{description}</figcaption>
          </picture>
        )
      }
      case 'quoteby':
        return (
          <div
            class="quoteby"
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
          <customTag>
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
            class="embeddedcode"
            domPropsInnerHTML={addTitleAndLazyloadToIframe(
              paragraph.content[0]
            )}
          />
        )
      case 'unstyled':
        return <p domPropsInnerHTML={paragraph.content[0]} />
      default:
        return undefined
    }
  },
}
</script>
