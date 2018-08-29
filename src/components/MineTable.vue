<template>
  <div class="mine">
    <table>
      <tbody>
        <tr v-for="(rowItems, index) of bombArray" :key="'row_' + index">
          <td @mousedown="cellClick(colItem, $event)" :class="{'show-bomb': colItem.showBomb, bomb: colItem.isBomb,mark: colItem.isMarked, 'mined-clear': colItem.minedClear}" :style="{width: cellWidth+'px', height: cellHeight + 'px'}" v-for="(colItem, index) of rowItems" :key="'col_' + index">
            <span v-if="!colItem.isBomb && colItem.minedClear && colItem.str !== '0'" :style="{color: getFontColor(colItem.str)}">{{colItem.str}}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import EventBus from "../plugins/eventBus";
export default {
  name: "mine-tbale",
  data() {
    return {
      bombArray: [],
      isPlaying: 1 //1: 重置状态   2: 结束状态 3： 运行状态
    };
  },
  created() {
    this.initRandomBombs();
    EventBus.$on("reset-table", () => {
      this.initRandomBombs();
      this.isPlaying = 1;
    });
  },
  watch: {
    rows() {
      EventBus.$emit("reset-table");
    },
    cols() {
      EventBus.$emit("reset-table");
    },
    level() {
      EventBus.$emit("reset-table");
    }
  },
  methods: {
    cellClick(item, e) {
      if (this.isPlaying === 1) {
        EventBus.$emit("begin-play", Date.now());
      } else if (this.isPlaying === 2) {
        return;
      }

      this.isPlaying = 3;
      // 如果已经清理了，就直接结束。
      if (item.minedClear) return;

      // 如果是已经被标记了，那么取消标记。
      if (item.isMarked) {
        this.$set(item, "isMarked", !item.isMarked);
        return; // 如果已经标记过，那么就是 误操作。
      }

      if (e.button === 0) {
        if (item.isBomb) {
          EventBus.$emit("bomb", Date.now());
          this.isPlaying = 2; // 设置当前状态
          this.bombArray.forEach(item => {
            item.forEach(cell => {
              cell.isBomb && this.$set(cell, "showBomb", "true");
            });
          });
        } else {
          //  不是炸弹，那么把雷区亮明。
          this.$set(item, "minedClear", true);
          // 设置 周围不是炸弹的同伴为mindedclear
          item.str === "0" && this.clearPartner(item);
          EventBus.$emit("click-cell");
        }
      } else {
        // 点击右键
        if (!item.minedClear) {
          EventBus.$emit("click-cell");
          this.$set(item, "isMarked", !item.isMarked);
        }
      }
      e.stopPropagation();
      e.preventDefault();
    },
    clearPartner(item) {
      let { x: rowIndex, y: colIndex } = item.pos;
      // 清空上下左右的地雷
      const _innerPartner = cell => {
        if (!cell.isBomb && !cell.minedClear) {
          this.$set(cell, "minedClear", true);
          if (cell.str == "0") {
            setTimeout(() => {
              this.clearPartner(cell);
            }, 1);
          }
        }
      };
      // up
      if (rowIndex - 1 >= 0) {
        let upCell = this.bombArray[rowIndex - 1][colIndex];
        _innerPartner(upCell);
      }
      // down
      if (rowIndex + 1 < this.rows) {
        let downCell = this.bombArray[rowIndex + 1][colIndex];
        _innerPartner(downCell);
      }
      // left
      if (colIndex - 1 >= 0) {
        let leftCell = this.bombArray[rowIndex][colIndex - 1];
        _innerPartner(leftCell);
      }
      // right
      if (colIndex + 1 < this.cols) {
        let rightCell = this.bombArray[rowIndex][colIndex + 1];
        _innerPartner(rightCell);
      }
    },
    // 初始化表格和炸弹数据
    initRandomBombs() {
      if (this.rows <= 0 || this.cols <= 0) {
        return;
      }
      let bombs = Math.floor(this.level * 0.15 * this.rows * this.cols);
      let bombSet = new Set();
      let randomIndex = -1; // eslint-disable-line
      randomIndex += 1;
      while (bombSet.size < bombs) {
        bombSet.add(
          Math.round((Math.random() * 7287) % (this.cols * this.rows))
        );
        randomIndex++;
        randomIndex %= this.rows * this.cols;
      }
      this.bombArray = [];
      for (let i = 0; i < this.rows; i++) {
        this.$set(this.bombArray, i, []);
        for (let j = 0; j < this.cols; j++) {
          let k = i * this.cols + j;
          let isBomb = bombSet.has(k);
          this.$set(this.bombArray[i], j, {
            isBomb,
            pos: { x: i, y: j },
            str: "",
            minedClear: false,
            isMarked: false,
            showBomb: false
          });
        }
      }

      // 把每个非炸弹的区域周围的炸弹💣个数初始化
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          this.$set(
            this.bombArray[i][j],
            "str",
            this.getArroundBombs(i, j, this.bombArray)
          );
        }
      }
    },
    // 获取周围的炸弹数据
    getArroundBombs(rowIndex, colIndex, arr) {
      let count = 0;
      let rowLen = this.rows;
      let colLen = this.cols;
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
      return count + "";
    },
    getFontColor(num) {
      num = +num;
      switch (num) {
        case 1:
          return "red";
        case 2:
          return "lightblue";
        case 3:
          return "#c09";
        case 4:
          return "yellow";
        case 5:
          return "#8a0";
        case 6:
          return "#180";
        case 7:
          return "#d96";
        default:
          return "white";
      }
    }
  },
  props: {
    level: {
      type: Number,
      required: true,
      default: 1
    },
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
      default: 40
    },
    cellWidth: {
      type: Number,
      required: true,
      default: 40
    }
  }
};
</script>

<style lang="scss" scoped>
.show-bomb {
  position: relative;
  &::before {
    position: absolute;
    content: "";
    top: 0;
    height: 100%;
    width: 100%;
    background: url(../assets/bomb.png);
    background-size: contain;
    left: 0;
  }
}

.mark {
  background: url(../assets/hq.png);
  background-size: cover;
}
.mined-clear {
  background-color: #321 !important;
}
.bomb {
  // background-color: red;
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
