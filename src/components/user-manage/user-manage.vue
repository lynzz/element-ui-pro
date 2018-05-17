<template>
  <div class="ql-user-manage" v-loading="loading">
    <div class="ql-user-manage__top">
      <el-input v-model="keywords" suffix-icon="el-icon-search" style="width: 300px" placeholder="请输入用户名或编码进行查找"></el-input>
      <el-button-group>
        <el-button type="success" @click="handleRoleAdd">添加角色</el-button>
        <el-button type="success" @click="handleUserAdd('')">添加用户</el-button>
      </el-button-group>
    </div>
    <el-collapse @change="handleCollapseChange" class="cqb-collapse">
      <el-collapse-item
        v-for="(item, roleIndex) in roleList"
        :name="item.roleId"
        :key="item.roleId">
        <template slot="title">
          {{item.roleName}}
          <span class="ql-user-manage__item-action">
            <el-button type="primary" v-if="item.roleId" size="mini" icon="el-icon-edit" @click.stop="handleRoleEdit(item.roleId)">
            </el-button>
            <el-button type="danger" size="mini" v-if="item.roleId" icon="el-icon-delete" @click.stop="handleRoleDelete(item.roleId, roleList, roleIndex)">
            </el-button>
          </span>
        </template>
        <el-card v-if="item.roleId" @click.native="handleUserAdd(item.roleId)" class="ql-user-manage__user ql-user-manage__user--add">
          <i class="el-icon-plus"></i>
          新增用户
        </el-card>
        <el-card
          body-style="padding: 0"
          class="ql-user-manage__user"
          :class="{
            disable: user.userStatus === '0'
          }"
          :key="userIndex"
          v-for="(user, userIndex) in item.users">
          <h3>{{user.userCode}}</h3>
          <p>{{user.userName}}</p>
          <ul class="ql-user-manage__user-actions">
            <li>
              <el-button @click="handleUserEdit(user.userCode)" type="text" size="small">编辑</el-button>
            </li>
            <li>
              <el-button @click="handleUserRemoveRole(user.userId, item.roleId)" type="text" :disabled="!item.roleId" size="small">解除</el-button>
            </li>
            <li>
              <el-button @click="handleUserDelete(user.userCode, item.users, userIndex)" type="text" size="small">删除</el-button>
            </li>
            <li>
              <el-button @click="handleUserChangeStatus(user)" type="text" size="small">{{user.userStatus === '0' ? '启用' : '停用'}}</el-button>
            </li>
          </ul>
        </el-card>
        <template v-if="!item.users.length && !item.roleId">
          该角色下暂无用户
        </template>
      </el-collapse-item>
    </el-collapse>
    <dialog-role
      @add="loadRole"
      @update="handleRoleUpdateSuccess"
      :id="roleId"
      v-model="showDialogRole">
    </dialog-role>
    <dialog-user
      @add="loadRole"
      @update="loadRole"
      :id="userCode"
      :role-id="roleId"
      :roles="roles"
      v-model="showDialogUser">
    </dialog-user>
  </div>
</template>

<script>
import DialogRole from './dialog-role'
import DialogUser from './dialog-user'
import {queryRole, deleteRole} from '@/api/role'
import {changeStatus, removeUserRole, delUser} from '@/api/user'
export default {
  name: 'QlUserManage',
  components: {
    DialogRole,
    DialogUser
  },

  data () {
    return {
      loading: false,
      keywords: '',
      roleList: [],
      cacheRoleList: [],
      roleId: null,
      userCode: null,
      showDialogRole: false,
      showDialogUser: false
    }
  },
  computed: {
    roles () {
      return this.roleList.filter(item => item.roleId)
    }
  },
  watch: {
    keywords (val) {
      let v = val.trim().toLowerCase()
      const matchValue = (user) => {
        return user.userCode.toLowerCase().indexOf(v) > -1 ||
          user.userName.toLowerCase().indexOf(v) > -1
      }
      if (v === '') {
        this.roleList = this.cacheRoleList
      } else {
        this.roleList = this.cacheRoleList.filter(item => {
          return item.users.some(matchValue)
        })
        // this.roleList.forEach(item => {
        //   item.users = item.users.filter(matchValue)
        // })
      }
    }
  },
  mounted () {
    this.loadRole()
  },
  methods: {
    loadRole () {
      this.loading = false
      queryRole().then(data => {
        this.roleList = this.cacheRoleList = data
        this.loading = false
      }).catch(_ => {
        this.loading = false
      })
    },
    handleRoleAdd () {
      this.roleId = null
      this.showDialogRole = true
    },
    handleRoleEdit (roleId) {
      this.roleId = roleId
      this.showDialogRole = true
    },
    async handleRoleDelete (roleId, list, index) {
      try {
        let deleted = await this.confirmDelete('确认删除该角色？')

        if (deleted) {
          let delRole = await deleteRole(roleId)
          if (delRole) {
            this.loadRole()
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleRoleAddSuccess (data) {
      this.loadRole()
    },
    handleRoleUpdateSuccess (data) {
      this.roleList.forEach(item => {
        if (item.roleId === data.roleId) {
          item.roleName = data.roleName
        }
      })
    },
    handleUserAdd (roleId) {
      this.userCode = null
      this.roleId = roleId
      this.showDialogUser = true
    },
    handleUserAddSuccess (data) {
      this.loadRole()
      // this.roleList.forEach(item => {
      //   if (data.roleIdList.indexOf(item.roleId) > -1) {
      //     item.users.push(data)
      //   }
      // })
    },
    handleUserUpdateSuccess (data) {
      this.roleList.forEach(item => {
        if (data.roleIdList.indexOf(item.roleId) > -1) {
          item.users.forEach(userItem => {
            if (userItem.userCode === data.userCode) {
              userItem.userName = data.userName
            }
          })
        } else {
          item.users.forEach((userItem, userIndex) => {
            if (userItem.userCode === data.userCode) {
              item.users.splice(userIndex, 1)
            }
          })
        }
      })
    },
    handleUserEdit (userCode) {
      this.userCode = userCode
      this.showDialogUser = true
    },
    handleUserRemoveRole (userId, roleId) {
      this.$confirm('确认将用户从该角色删除', '提示', {
        confirmButtonText: '解除',
        confirmButtonClass: 'el-button--danger'
      }).then(() => {
        removeUserRole(userId, roleId).then(() => {
          this.loadRole()
        })
      })
    },
    handleUserChangeStatus (user) {
      const {userCode, userStatus} = user
      const disabled = userStatus === '0'
      const title = disabled ? '确认启用该用户' : '确认停用该用户'
      const message = disabled ? '已启用该用户' : '已停用该用户'
      const buttonText = disabled ? '启用' : '停用'
      const status = disabled ? '1' : '0'
      const type = disabled ? 'success' : 'danger'
      this.$confirm(title, '提示', {
        confirmButtonText: buttonText,
        showIcon: true,
        type: 'info',
        confirmButtonClass: `el-button--${type}`
      }).then(() => {
        changeStatus({
          userCode,
          status
        }).then(() => {
          user.userStatus = status
          this.$message.success(message)
        })
      })
    },
    handleUserDelete (userCode, list, index) {
      this.confirmDelete('确认删除该用户？').then(_ => {
        delUser(userCode).then(data => {
          this.roleList.forEach(item => {
            item.users.forEach((userItem, userIndex, list) => {
              if (userItem.userCode === userCode) {
                list.splice(userIndex, 1)
              }
            })
          })
        })
      })
    },
    handleCollapseChange (activeName) {
      // let activeItem = this.roleList.find(item => item.roleId === activeName)
      // let roleId = activeName === 'default' ? null : activeName
      // if (activeItem && !activeItem.loaded) {
      //   this.findUser(roleId).then(data => {
      //     activeItem.users = data
      //     activeItem.loaded = true
      //   })
      // }
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/mixins/utils.scss";
@import "../../assets/scss/common/var.scss";
.ql-user-manage {
  .el-collapse-item__header{
    background: #e1f5fe;
    font-size: 16px;
    padding-left:15px;
    border:1px solid #d1e8f3;
    margin-top:4px;
    &.is-active{
        background: #81d4fa;
        color:white;
    }
  }
  .el-collapse-item__content {
    padding:15px 15px 10px;
    border:1px solid #d1e8f3;
    border-top:none;
    display: flex;
  }
  &__top {
    margin-bottom: 10px;
    .el-button-group {
      float: right;
    }
  }
  &__user {
    width: 200px;
    background: #4fc3f7 url("../../assets/img/avatar-bg.png") no-repeat;
    background-size: 56px 56px;
    background-position: 7px 10px;
    margin-right: 10px;
    color:white;
    h3{
      margin-bottom:5px;
      color:white;
      font-size:16px;
      text-align: left;
      margin-top:8px;
      padding-left:80px;
    }
    p{
      text-align: left;
      padding-left:80px;
      margin:8px 0;
    }
    &--add {
      display: flex;
      background: $--color-success;
      justify-content: center;
      align-items: center;
      border: 1px dashed #ccc;
      cursor: pointer;
      font-size: 18px;
      min-height:110px;
      &:hover {
        border-color: $--color-primary;
        background: rgba($--color-success,.9);
      }
    }
    &.disable {
      background-color: #78909c;
    }
    &-actions {
      background: rgba(0,0,0,.2);
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      li {
        flex: 1;
        padding: 5px 0;
        text-align: center;
        .el-button--text {
          padding: 0;
          color:white;
        }
          &:hover{
           background: rgba($--color-primary,.8);
          }
        &:not(:last-child) {
          // border-right: 1px solid #e8e8e8;
        }
      }
    }
  }
  &__item-action {
    float: right;
    padding-right: 10px;
  }
}
</style>
