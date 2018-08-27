<template>
  <div class="mine">
    <table>
      <tbody>
        <tr v-for="item of rows" :key="'row_' + item">
          <td :style="{width: cellWidth+'px', height: cellHeight + 'px'}" v-for="colItem of cols" :key="'col_' + colItem"></td>
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
      bomArray: []
    };
  },
  created() {},
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
table {
  border-collapse: collapse;
}
td {
  border: 1px solid #c09;
  height: 30px;
  width: 30px;
  background-color: aliceblue;
}
</style>
