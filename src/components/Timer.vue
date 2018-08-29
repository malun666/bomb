<template>
  <div class="timer">
  {{hh}}小时{{mm}}分钟{{ss}}秒钟
  </div>
</template>

<script>
import EventBus from "../plugins/eventBus.js";
export default {
  name: "timer",
  data() {
    return {
      hh: "00",
      mm: "00",
      ss: "00",
      start: 0,
      end: 0,
      timer: 0
    };
  },
  created() {
    let vm = this;
    EventBus.$on("begin-play", startDate => {
      vm.start = startDate;
      vm.timer = setInterval(() => {
        let allSeconds = (Date.now() - vm.start) / 1000;
        vm.ss = String(Math.trunc(allSeconds % 60)).padStart(2, "0");
        vm.mm = String(Math.trunc((allSeconds / 60) % 60)).padStart(2, "0");
        vm.hh = String(Math.trunc(allSeconds / (60 * 60))).padStart(2, "0");
      }, 100);
    });
    EventBus.$on("bomb", endDate => {
      this.end = endDate;
      clearTimeout(vm.timer);
    });
    EventBus.$on("reset-table", () => {
      clearTimeout(vm.timer);
      Object.assign(vm, {
        hh: "00",
        mm: "00",
        ss: "00",
        start: 0,
        end: 0,
        timer: 0
      });
    });
  }
};
</script>

<style scoped>
</style>
