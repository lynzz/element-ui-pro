<template>
  <el-tag
    :type="type"
    :closable="closable"
    @close="handleClose"
    @click.native="handleClick"
    @mouseenter.native="handleMouseenter"
    @mouseleave.native="handleMouseleave"
    class="ql-tag">
    <ql-icon v-if="icon" :name="icon"></ql-icon>
    <span v-if="label" class="ql-tag__title">
      {{label}}
    </span>
    <slot>

    </slot>
  </el-tag>
</template>

<script>
export default {
  name: 'QlTag',
  props: {
    icon: String,
    type: {
      default: ''
    },
    closable: Boolean,
    label: String
  },
  data () {
    return {
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    handleClick () {
      this.$emit('click')
    },
    handleMouseenter (e) {
      this.$emit('mouseenter', e)
    },
    handleMouseleave (e) {
      this.$emit('mouseleave', e)
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/mixins/mixins.scss";

@include b(tag) {
  cursor: pointer;
  display: inline-block;
  @include e(title) {
    margin-right: 16px;
  }
  & > span {
    cursor: pointer;
  }
}

</style>
