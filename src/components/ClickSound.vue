<template>
  <div class="sound">
    <audio ref="soundDom" :src="source"></audio>
  </div>
</template>

<script>
import EventBus from "../plugins/eventBus.js";
export default {
  name: "click-sound",
  props: {
    eventname: { type: String, default: "click-cell", required: true },
    source: { type: String, default: "a.mp3", required: true }
  },
  created() {
    EventBus.$on(this.eventname, () => {
      this.$refs.soundDom.play();
    });
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.sound {
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
}
</style>
