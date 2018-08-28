<template>
  <div class="mine">
    <table>
      <tbody>
        <tr v-for="(rowItems, index) of bombArray" :key="'row_' + index">
          <td :class="{bomb: colItem.isBomb}" :style="{width: cellWidth+'px', height: cellHeight + 'px'}" v-for="(colItem, index) of rowItems" :key="'col_' + index">
            <template v-if="!colItem.isBomb">{{colItem.str}}</template>
            <template v-else>{{colItem.data}}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "mine-tbale",
  data() {
    return {
      bombArray: []
    };
  },
  created() {
    this.initRandomBombs();
  },
  watch: {
    rows() {
      console.log(1);
      this.initRandomBombs();
    },
    cols() {
      this.initRandomBombs();
    }
  },
  methods: {
    initRandomBombs() {
      if (this.rows <= 0 || this.cols <= 0) {
        return;
      }
      for (let i = 0; i < this.rows; i++) {
        this.bombArray[i] = [];
        for (let j = 0; j < this.cols; j++) {
          let isBomb = Math.round(Math.random());
          this.bombArray[i][j] = {
            isBomb,
            data: +isBomb,
            str: ""
          };
        }
      }
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.bombArray[i][j].str = this.getArroundBombs(i, j, this.bombArray);
        }
      }
    },
    getArroundBombs(rowIndex, colIndex, arr) {
      let count = 0;
      let rowLen = arr.length;
      let colLen = arr[0].length;
      // 3行 3 列的数据相加即可得到总数据，然后扣掉元素本身的数据即可得到所有的数据。
      for (let r = -1; r <= 1; r++) {
        if (rowIndex + r < 0 || rowIndex + r >= rowLen) continue;
        for (let c = -1; c <= 1; c++) {
          if (colIndex + c < 0 || colIndex + c >= colLen) continue;
          if (arr[rowIndex + r][colIndex + c].isBomb) {
            count += 1;
          }
        }
      }
      return count;
    }
  },
  props: {
    rows: {
      type: Number,
      required: true
    },
    cols: {
      type: Number,
      required: true
    },
    cellHeight: {
      type: Number,
      required: true,
      default: 30
    },
    cellWidth: {
      type: Number,
      required: true,
      default: 30
    }
  }
};
</script>

<style lang="scss" scoped>
.bomb {
  background-color: red;
}
table {
  border-collapse: collapse;
}
td {
  border: 1px solid #c09;
  height: 30px;
  width: 30px;
  background-color: aliceblue;
  text-align: center;
  vertical-align: middle;
}
</style>
