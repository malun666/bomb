<template>
  <div id="app">
    <div class="layout">
      <div class="main">
        <mine-table :rows="rows" :cell-height="cellHeight" :cell-width="cellWidth" :cols="columns"></mine-table>      
      </div>
      <div class="aside">
        <div class="block">
          <span class="demonstration">列数：{{columns}}</span>
          <el-slider :min="1" v-model="columns"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">行数：{{rows}}</span>
          <el-slider :min="1" v-model="rows"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">单元格宽：{{cellWidth}}</span>
          <el-slider :min="1" v-model="cellWidth"></el-slider>
        </div>
        <div class="block">
          <span class="demonstration">单元格高度：{{cellHeight}}</span>
          <el-slider :min="1" v-model="cellHeight"></el-slider>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MineTable from "./components/MineTable";
export default {
  name: "app",
  data: function() {
    return {
      rows: 10,
      columns: 10,
      cellWidth: 30,
      cellHeight: 30
    };
  },
  components: {
    "mine-table": MineTable
  }
};
</script>

<style lang="scss">
#app {
  .layout {
    display: flex;
    flex-flow: row nowrap;
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
    flex: 1 0 100px;
  }
}
</style>
