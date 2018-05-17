<template>
<div>
  <transition-group :name="closeTransition ? '' : 'ql-card-list'" tag="div" class="ql-card-list">
    <el-card
      :key="index"
      :style="{
        width: itemWidth + 'px'
      }"
      v-for="(item, index) in data"
      class="ql-card-list__item"
      @click.native="handleClick(item)">
      <slot :card="item"></slot>
    </el-card>
  </transition-group>
  <div class="ql-card-list__empty" v-if="!data.length">
    暂无数据
  </div>
</div>
</template>

<script>
export default {
  name: 'QlCardList',
  props: {
    data: Array,
    closeTransition: {
      default: false
    },
    itemWidth: {
      type: [String, Number],
      default: 240
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleClick (item) {
      this.$emit('item-click', item)
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/common/var.scss";
@import "../../assets/scss/mixins/mixins.scss";
@include b(card-list) {
  position: relative;
  backface-visibility: hidden;
  @include e(item) {
    margin-bottom: 15px;
    margin-right: 10px;
    cursor: pointer;
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    backface-visibility: hidden;
    transform-origin: 10% 50%;
    z-index: 1;
  }
  @include e(empty) {
    width: 100%;
    text-align: center;
  }

  &-move { transition: all 600ms ease-in-out 50ms }
  &-enter-active { transition: all 300ms ease-out }

  &-leave-active {
    transition: all 200ms ease-in;
    position: absolute;
    z-index: 0;
  }

  &-enter,
  &-leave-to { opacity: 0 }
  &-enter { transform: scale(0.9) }
}
</style>
