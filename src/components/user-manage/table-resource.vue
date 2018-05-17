<template>
  <ql-table class="ql-table-resource">
    <tr v-for="item in currResources" :key="item.code">
      <th>
        <el-checkbox
          @change="handleParentChange(item)"
          v-model="item.checked"
          :label="item.code">
          {{item.label}}
        </el-checkbox>
      </th>
      <td>
        <template v-if="item.children">
          <el-checkbox
            @change="handleChildChange(item, subItem)"
            v-for="subItem in item.children"
            :key="subItem.code"
            v-model="subItem.checked"
            :label="subItem.code">
            {{subItem.label}}
          </el-checkbox>
        </template>
      </td>
    </tr>
  </ql-table>
</template>

<script>
import navConfig from '@/router/nav.config'

export default {
  name: 'QlTableResource',
  model: {
    prop: 'checked',
    event: 'checked-change'
  },
  props: {
    // 已授权的资源
    checked: Array
  },
  data () {
    return {
      currResources: []
    }
  },
  computed: {
    resources () {
      return navConfig.filter(item => item.code)
    }
  },
  watch: {
    checked (val) {
      this.updateResourceStatus()
    }
  },
  mounted () {
    this.updateResourceStatus()
  },
  methods: {
    updateCheckedValue () {
      let ret = []
      let val = this.currResources
      if (val && val.length) {
        val.forEach(item => {
          if (item.checked) {
            ret.push(item.code)
          }
          item.children && item.children.forEach(subItem => {
            if (subItem.checked) {
              ret.push(subItem.code)
            }
          })
        })
      }
      this.$emit('checked-change', ret)
    },
    updateResourceStatus () {
      this.currResources = this.resources.map(item => {
        let checked = this.checked.indexOf(item.code) > -1
        if (item.children) {
          return {
            ...item,
            children: item.children.map(subItem => {
              return {
                ...subItem,
                checked: this.checked.indexOf(subItem.code) > -1
              }
            }),
            checked
          }
        } else {
          return {
            ...item,
            checked
          }
        }
      })
    },
    handleParentChange (item) {
      item.children && item.children.forEach(subItem => {
        subItem.checked = item.checked
      })
      item.indeterminate = false
      this.updateCheckedValue()
    },
    handleChildChange (item, subItem) {
      let checkedCount = item.children.filter(n => n.checked).length
      item.checked = checkedCount > 0
      this.updateCheckedValue()
    }
  }
}
</script>
<style lang="scss">
.ql-table-resource {
  width: 90%;
  .el-checkbox {
    margin-right: 6px;
    margin-bottom: 6px;
    &+.el-checkbox {
      margin-left: 0;
    }
  }
  & th {
    text-align: left;
  }
  & td {
    white-space: normal!important;
  }
}
</style>
