export default function getElementInnerText(eventTarget) {
  return eventTarget.textContent
    ? eventTarget.textContent.replace(/<\/?[^>]+(>|$)/g, '')
    : ''
}
