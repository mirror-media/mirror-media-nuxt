export default function getWindowSizeInfo() {
  return {
    width: document.documentElement.clientWidth || document.body.clientWidth,
    height: document.documentElement.clientHeight || document.body.clientHeight,
  }
}
