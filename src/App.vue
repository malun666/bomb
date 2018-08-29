<template>
  <div id="app">
    <div class="layout">
      <div class="main">
        <mine-table :level="level" :rows="rows" :cell-height="cellHeight" :cell-width="cellWidth" :cols="columns"></mine-table>
        <hr>
        <timer></timer>
      </div>
      <div class="aside">
        <div class="block">
          <span class="demonstration">难度：{{getLevelLable}}</span>
          <el-slider show-stops :min="1" :max="3" v-model="level"></el-slider>
        </div>
        <hr>
        <div class="block">
          <span class="demonstration">列数：{{columns}}</span>
          <el-slider :min="5" v-model="columns"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">行数：{{rows}}</span>
          <el-slider :min="5" v-model="rows"></el-slider>
        </div>
        <hr>
        <el-switch style="display: block" v-model="isCellSync" active-color="#13ce66" inactive-color="#ff4949" active-text="单元格宽高同步">
        </el-switch>
        <hr>
        <div class="block">
          <span class="demonstration">单元格宽：{{cellWidth}}</span>
          <el-slider :min="1" v-model="cellWidth"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">单元格高度：{{cellHeight}}</span>
          <el-slider :min="1" v-model="cellHeight"></el-slider>
        </div>
        <hr>
        <el-button @click="reset"  type="danger">重置</el-button>
      </div> 
    </div>
    <click-sound eventname="click-cell" source="a.mp3"></click-sound>
    <click-sound eventname="bomb" source="b.mp3"></click-sound>
  </div>
</template>
<script>
import MineTable from "./components/MineTable";
import EventBus from "./plugins/eventBus.js";
import Timer from "./components/Timer";
import ClickSound from "./components/ClickSound";
export default {
  name: "app",
  data: function() {
    return {
      rows: 10,
      columns: 10,
      cellWidth: 40,
      cellHeight: 40,
      isCellSync: true,
      level: 1
    };
  },
  created() {
    document.oncontextmenu = function() {
      return false;
    };
  },
  methods: {
    reset() {
      // this.$message.confir
      this.$confirm("确认是否要重置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          EventBus.$emit("reset-table");
        })
        .catch(() => {});
    }
  },
  computed: {
    getLevelLable() {
      switch (this.level) {
        case 1:
          return "简单";
        case 2:
          return "中级";
        case 3:
          return "高级";
        default:
          return "简单";
      }
    }
  },
  watch: {
    cellWidth: function(newVal) {
      if (this.isCellSync) {
        this.cellHeight = newVal;
      }
    },
    cellHeight: function(newVal) {
      if (this.isCellSync) {
        this.cellWidth = newVal;
      }
    }
  },
  components: {
    "mine-table": MineTable,
    timer: Timer,
    "click-sound": ClickSound
  }
};
</script>

<style lang="scss">
#app {
  .layout {
    display: flex;
    flex-flow: row nowrap;
    font-size: 14px;
  }
  .layout > div {
    min-height: 300px;
    border: 1px solid #c09;
    box-sizing: border-box;
  }
  .main {
    flex: 5 0 500px;
  }
  .aside {
    padding: 10px;
    flex: 2 0 100px;
  }
}
</style>
