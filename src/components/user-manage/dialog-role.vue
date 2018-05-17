<template>
  <ql-dialog :title="title" :visible="showDialog" :before-close="handleClose">
    <el-form :model="form" ref="form" label-width="120px" :rules="rules">
      <el-form-item label="角色名称" prop="roleName">
        <el-input style="width: 300px" v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色权限" prop="rightCodes">
        <table-resource v-model="form.rightCodes" id="role-list"></table-resource>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleOk">确定</el-button>
    </div>
  </ql-dialog>
</template>

<script>
import Dialog from '@/mixins/dialog'
import TableResource from './table-resource'
import {getRole, addRole, updateRole} from '@/api/role'
export default {
  name: 'QlDialogRole',
  components: {
    TableResource
  },
  mixins: [Dialog],
  props: {
    id: [Number, String]
  },
  computed: {
    title () {
      return this.id ? '编辑角色' : '添加角色'
    }
  },
  data () {
    return {
      form: {
        roleName: '',
        roleType: '1',
        rightCodes: [],
        optList: []
      },
      rules: {
        roleName: [
          {required: true, message: '请输入角色名称'}
        ],
        rightCodes: [
          {required: true, message: '请勾选角色权限'}
        ]
      }
    }
  },
  watch: {
    showDialog (val) {
      if (!val) {
        this.$refs.form.resetFields()
      } else if (this.id) {
        getRole(this.id).then(data => {
          this.form = Object.assign({}, this.form, data)
        })
      }
    }
  },
  methods: {
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {...this.form}

          if (this.id) {
            updateRole(this.id, params).then(data => {
              this.$message.success('角色已更新')
              this.$emit('update', data)
              this.showDialog = false
            })
          } else {
            addRole(params).then(data => {
              this.$message.success('角色已添加')
              this.$emit('add', data)
              this.showDialog = false
            })
          }
        }
      })
    },
    handleCancel () {
      this.showDialog = false
    }
  }
}
</script>
