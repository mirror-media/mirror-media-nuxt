<template>
  <div>
    <ClientOnly>
      <GptAd
        adUnit="mirror_RWD_2022FIFA_970250-300250_FT"
        :adSize="[
          [970, 250],
          [300, 250],
        ]"
        v-on="$listeners"
      />
    </ClientOnly>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped></style>
