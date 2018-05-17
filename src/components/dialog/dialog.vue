<template>
  <el-dialog
    v-draggable
    class="ql-dialog"
    :fullscreen="fullscreen"
    v-bind="$attrs">
    <div slot="title">
      <span class="el-dialog__title">{{$attrs.title}}</span>
      <div class="ql-dialog__toolbar">
        <ql-icon :name="fullscreen ? 'restored' : 'max'" @click="handleToggle"></ql-icon>
      </div>
    </div>
    <slot></slot>
    <div slot="footer">
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'QlDialog',
  data () {
    return {
      fullscreen: false
    }
  },

  methods: {
    handleToggle (e) {
      this.fullscreen = !this.fullscreen
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/mixins/mixins.scss";
@import "../../assets/scss/common/var.scss";
@include b(dialog){
  .el-dialog {
    &.is-fullscreen {
      width: 100% !important;
      left: 0!important;
      top: 0!important;
    }
    &.is-draggable {
      .el-dialog__header {
        user-select: none;
        cursor: move;
      }
    }
  }
  @include e(toolbar) {
    position: absolute;
    top: 17px;
    right: 32px;
    cursor: pointer;

    .cqbicon {
      color: #999;
      &:hover {
        color: $--link-hover-color;
      }
    }
  }
}
</style>
