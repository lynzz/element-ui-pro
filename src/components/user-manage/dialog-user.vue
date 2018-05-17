<template>
  <ql-dialog :title="title" :visible="showDialog" :before-close="handleClose">
    <el-form :model="form" ref="form" label-width="120px" :rules="rules">
      <el-form-item label="用户名" prop="userCode">
        <el-input :disabled="!!id" v-model="form.userCode"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPwd">
        <el-input type="password" v-model="form.userPwd"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="form.roleIds" multiple>
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :value="item.roleId"
            :label="item.roleName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管理单位" prop="labDeptIds">
        <el-select v-model="form.labDeptIds">
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :value="item.deptId"
            :label="item.deptName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleOk">确定</el-button>
    </div>
  </ql-dialog>

</template>

<script>
import md5 from 'md5'
import Dialog from '@/mixins/dialog'
import {getUser, addUser, updateUser} from '@/api/user'
import {getDeptOptions} from '@/api/common'
import {PASSPORD_HASH} from '@/utils/const'
export default {
  name: 'QlDialogUser',
  components: {
  },
  mixins: [Dialog],
  props: {
    id: [String, Number],
    // 角色列表
    roles: Array,
    roleId: [Number, String],
    getZyz: Function
  },
  computed: {
    title () {
      return this.id ? '编辑用户信息' : '添加用户信息'
    }
  },
  data () {
    // const validPwd = (rule, value, callback) => {
    //   if (this.id) {
    //     callback()
    //   } else if (value === '') {
    //     callback(new Error('请输入密码'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      showDialogZyz: false,
      deptList: [],
      form: {
        userName: '',
        userCode: '',
        userPwd: '',
        remark: '',
        labDeptIds: '',
        roleIds: []
      },
      rules: {
        userCode: [
          {required: true, message: '请输入用户名'}
        ],
        userName: [
          {required: true, message: '请输入姓名'}
        ],
        roleIds: [
          {required: true, message: '请选择角色'}
        ],
        // userPwd: [
        //   {validator: validPwd, trigger: 'blur'}
        // ],
        labDeptIds: [
          {required: true, message: '请选择管理单位'}
        ]
      }
    }
  },
  watch: {
    showDialog (val) {
      if (!val) {
        this.$refs.form.resetFields()
      } else {
        getDeptOptions().then(data => {
          this.deptList = data
        })
        this.id && getUser(this.id).then(data => {
          this.form = Object.assign({}, this.form, data)
          this.form.labDeptIds = this.form.labDeptIds[0]
        })
      }
    },
    roleId (val) {
      if (!this.id && val) {
        this.form.roleIds = [val]
      }
    }
  },
  methods: {
    handleSetGroup () {
      this.showDialogZyz = true
    },
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {...this.form}

          if (params.userPwd) {
            params.userPwd = md5(`${params.userPwd}${PASSPORD_HASH}`)
          }
          if (this.id) {
            updateUser(params).then(data => {
              this.$message({
                type: 'success',
                message: '用户已更新'
              })
              this.$emit('update', data)
              this.showDialog = false
            })
          } else {
            addUser(params).then(data => {
              this.$message({
                type: 'success',
                message: '用户已添加'
              })
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
