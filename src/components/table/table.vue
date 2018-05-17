<template>
  <table
    cellpadding="0"
    cellspacing="0"
    :class="{
      'ql-table--border': border,
      'ql-table--center': center,
      'ql-table--compact': compact,
      'is-gray': gray,
      'is-dark': dark,
      'is-fixed-cell': fixedCell
    }"
    class="ql-table">
    <slot></slot>
  </table>
</template>

<script>
export default {
  name: 'QlTable',
  props: {
    border: {
      type: Boolean,
      default: true
    },
    center: Boolean,
    // 背景暗色系
    dark: Boolean,
    gray: Boolean,
    // 固定单元格高度为 40 px
    fixedCell: Boolean,
    compact: Boolean
  },
  data () {
    return {
    }
  },
  mounted () {

  }
}
</script>
<style lang="scss">
@import "../../assets/scss/common/var.scss";
@import "../../assets/scss/mixins/mixins.scss";
$border-gray-color: #c8c8c8;
$background-gray-color: #d3d3d3;
@include b(table) {
  border-color: $--border-color-lighter;
  table-layout: fixed;
  width: 100%;
  & th, td {
    padding: 3px 8px;
    min-width: 0;
    box-sizing: border-box;
    @utils-ellipsis;
    vertical-align: middle;
    position: relative;
  }
  & th{
    padding:6px 8px;
  }

  @include m(border) {
    & th, td {
      border: 1px solid $--border-color-lighter;
    }

    @include when(gray) {
      & th, td {
        border-color: $border-gray-color;
      }
    }

    @include when(dark) {
      & th, td {
        color:white;
        border-color: rgba(255,255,255,0.3);
        background-color:rgba(100,100,100,0.8);
        border-bottom:1px solid rgba(255,255,255,0.3);
      }
    }
  }
  @include m(center) {
    & th, td {
      text-align: center;
    }
  }
  @include m(compact) {
    & td {
      padding: 0;
    }
  }
  @include when(gray) {
    border-color: $border-gray-color;
    & th, td {
      color: #333;
    }

    & th {
      background: $background-gray-color;
    }
  }
  @include when(fixed-cell) {
    & th, td {
      padding: 0;
      height: 40px;
      .cell {
        padding-left: 8px;
        padding-right: 8px;
        @utils-ellipsis;
        color: $--table-text-color;
        word-break: initial;
      }
    }
    & th .cell {
      color: #ccc;
    }
  }
  & td {
    color: $--table-text-color;
  }
  & th {
    color: #81d4fa;
  }
}
</style>
