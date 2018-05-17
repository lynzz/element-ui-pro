<template>
  <el-date-picker v-bind="$attrs" v-model="currentDate" class="ql-date-picker"></el-date-picker>
</template>

<script>
import moment from 'moment'
export default {
  inheritAttrs: false,
  name: 'QlDatePicker',
  model: {
    prop: 'selected',
    event: 'selected-change'
  },
  props: {
    selected: [Number, String, Array]
  },
  data () {
    return {
      currentDate: this.toDate(this.selected)
    }
  },
  computed: {
    currentFormat () {
      if (this.$attrs.type === 'year') {
        return 'YYYY'
      } else if (this.$attrs.type === 'month') {
        return 'YYYYMM'
      } else {
        return 'YYYYMMDD'
      }
    }
  },
  watch: {
    selected (val) {
      this.currentDate = this.toDate(val)
    },
    currentDate (val) {
      if (val) {
        this.$emit('selected-change', moment(val).format(this.currentFormat))
      }
    }
  },
  methods: {
    toDate (val) {
      if (!val) return new Date()
      let month = new Date().getMonth() + 1
      let date = new Date().getDate()
      let year
      if (this.$attrs.type === 'year') {
        year = val
      } else {
        year = val.slice(0, 4)
        month = val.slice(4, 6)
        if (!this.$attrs.type) {
          date = val.slice(6, 8)
        }
      }

      return new Date(`${year}-${month}-${date}`)
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/mixins/mixins.scss";
@import "../../assets/scss/common/var.scss";
@include b(date-picker){

}
</style>
