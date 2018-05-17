<template>
  <i :class="[cls]" @click.stop="handleClick"></i>
</template>

<script>
export default {
  name: 'QlIcon',
  props: {
    name: String
  },
  computed: {
    cls () {
      if (this.name) {
        return `iconfont icon-${this.name}`
      }
      return ''
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
