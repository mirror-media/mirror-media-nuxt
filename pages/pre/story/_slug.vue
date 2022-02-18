<template>
  <div>premium story page, slug is {{ $route.params.slug }}</div>
</template>

<script>
export default {
  middleware: ['handle-story-premium-redirect'],
}
</script>
