<script>
export default {
  name: 'UIStoryContentHandler',
  functional: true,
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
      case 'unstyled':
        return <p domPropsInnerHTML={paragraph.content[0]} />
      default:
        return undefined
    }
  },
}
</script>
