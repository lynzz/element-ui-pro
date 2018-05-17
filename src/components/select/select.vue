<template>
  <el-select
    v-model="currentValue"
    :disabled="disabled"
    :clearable="clearable"
    :allow-create="allowCreate"
    :multiple="multiple"
    :filterable="filterable">
    <el-option
      :key="item.value"
      :value="item.value"
      :label="item.label"
      v-for="item in list">
    </el-option>
  </el-select>
</template>

<script>
export default {
  model: {
    prop: 'selected',
    event: 'selected-change'
  },
  props: {
    value: {
      type: String,
      default: 'value'
    },
    defaultFirst: Boolean,
    filterable: {
      type: Boolean,
      default: true
    },
    clearable: Boolean,
    allowCreate: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'label'
    },
    hasAll: Boolean,
    disabled: Boolean,
    // 当前已选择的，用 v-model 方式定义即可
    selected: {
      type: [Number, String, Array],
      default: ''
    },
    multiple: Boolean
  },
  watch: {
    selected (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('selected-change', val)
      if (val) {
        this.list.forEach(item => {
          if (val === item.value) {
            this.$emit('change', val, item)
            return false
          }
        })
      }
    }
  },
  data () {
    return {
      list: [],
      currentValue: ''
    }
  },
  methods: {
    transformData (data) {
      data.forEach(item => {
        item.value = item[this.value]
        item.label = item[this.label]
      })
      if (this.hasAll) {
        data = [{label: '全部', value: ''}].concat(data)
      }
      this.list = data
      if (this.defaultFirst && this.list.length) {
        this.$nextTick(() => {
          this.currentValue = this.list[0].value
        })
      }
    },
    handleChange (val, item) {
      this.$emit('change', val, item)
    }
  }
}
</script>
