<template>
  <div class="spinner">
    <div
      v-for="order in 5"
      :key="order"
      :class="['bounce', `bounce${order}`]"
      :style="{ backgroundColor: color }"
    />
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#989898',
    },
  },
}
</script>

<style lang="scss" scoped>
.spinner {
  text-align: center;
}

.spinner > div {
  width: 9px;
  height: 9px;
  margin: 0 2px;
  background-color: #989898;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

.spinner .bounce3 {
  -webkit-animation-delay: -0.08s;
  animation-delay: -0.08s;
}

.spinner .bounce4 {
  -webkit-animation-delay: -0.04s;
  animation-delay: -0.04s;
}

.spinner .bounce5 {
  -webkit-animation-delay: -0.02s;
  animation-delay: -0.02s;
}
@-webkit-keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bouncedelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
