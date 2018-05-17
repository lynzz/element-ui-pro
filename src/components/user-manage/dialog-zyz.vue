<template>
  <ql-dialog title="设置专业组" :visible="showDialog" :before-close="handleClose">
    <el-button-group style="margin-bottom: 10px;">
      <el-button type="info" @click="handleCheckAll">全选</el-button>
      <el-button type="info" @click="handleUncheckAll">反选</el-button>
    </el-button-group>
    <el-tree
      v-if="showDialog"
      ref="tree"
      show-checkbox
      node-key="zyzId"
      :default-checked-keys="defaultCheckedKeys"
      :data="treeData"
      @check-change="handleNodeCheck">
    </el-tree>
    <div slot="footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="handleOk">确定</el-button>
    </div>
  </ql-dialog>
</template>

<script>
import Dialog from '@/mixins/dialog'
export default {
  name: 'QlDialogZyz',
  mixins: [Dialog],
  props: {
    fetch: Function,
    // 已设置数据
    model: Object
  },
  computed: {
    defaultCheckedKeys () {
      return this.model ? this.model.zyzIds : []
    }
  },
  data () {
    return {
      treeData: [],
      checkedNodes: [],
      userZyz: {...this.model}
    }
  },
  watch: {
    showDialog (val) {
      if (val) {
        if (!this.treeData.length) {
          this.fetch().then(data => {
            this.treeData = data
            this.updateTreeStatus()
          })
        } else {
          this.updateTreeStatus()
        }
      }
    },

    checkedNodes (val) {
      let allZyzIds = this.userZyz.zyzIds = val.map(item => item.zyzId)
      this.userZyz.allZyz = this.treeData.every(item => allZyzIds.indexOf(item.zyzId) > -1)
    }
  },
  mounted () {

  },
  methods: {
    updateTreeStatus () {
      this.$nextTick(() => {
        if (this.userZyz.allZyz) {
          this.handleCheckAll()
        }
      })
    },
    handleOk () {
      // this.userZyz.zyzIds = this.checkedNodes.map(item => item.zyzId)
      // this.userZyz.allZyz = this.checkedNodes.length >= this.treeData.length
      this.$emit('update:model', this.userZyz)
      this.showDialog = false
    },
    handleNodeCheck (data, checked, indeterminate) {
      this.checkedNodes = this.$refs.tree.getCheckedNodes()
    },
    handleCheckAll () {
      let checkedNodes = this.treeData.map(item => item.zyzId)
      this.$refs.tree.setCheckedKeys(checkedNodes)
    },
    handleUncheckAll () {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>
