<template>
  <div class="ql-user-manage" v-loading="loading">
    <div class="ql-user-manage__top">
      <el-input style="width: 300px" placeholder="请输入用户名或编码进行查找"></el-input>
      <el-button type="primary">查询</el-button>
      <el-button-group>
        <el-button type="primary" :disabled="!hasEditRight" @click="handleRoleAdd">添加角色</el-button>
        <el-button type="primary" :disabled="!hasEditRight" @click="handleUserAdd">添加用户</el-button>
      </el-button-group>
    </div>
    <el-collapse @change="handleCollapseChange" accordion>
      <el-collapse-item
        v-for="(item, roleIndex) in roleList"
        :name="item.roleId"
        :key="item.roleId">
        <template slot="title">
          {{item.roleName}}
          <span class="ql-user-manage__item-action">
            <el-button type="primary" v-if="item.roleId !== 'default'" :disabled="!hasEditRight" size="mini" icon="el-icon-edit" @click.stop="handleRoleEdit(item.roleId)">
            </el-button>
            <el-button type="danger" :disabled="!hasDeleteRight" size="mini" v-if="item.roleType === '1'" icon="el-icon-delete" @click.stop="handleRoleDelete(item.roleId, roleList, roleIndex)">
            </el-button>
          </span>
        </template>
        <ql-tag
          :key="user.userId"
          :closable="hasDeleteRight"
          @close="handleUserDelete(user.userId, item.userList, userIndex)"
          icon="people"
          v-for="(user, userIndex) in item.userList">
          <span @click="handleUserEdit(user.userId)">{{user.userName}}</span>
          <!-- <el-button @click="handleUserEdit(user.userId)" type="text" size="small">编辑</el-button>
          <el-button @click="handleUserDelete(user.userId, item.userList, userIndex)" type="text" size="small">删除</el-button> -->
        </ql-tag>
        <template v-if="!item.userList.length">
          该角色下暂无用户
        </template>
      </el-collapse-item>
    </el-collapse>
    <dialog-role
      @add="handleRoleAddSuccess"
      @update="handleRoleUpdateSuccess"
      :id="roleId"
      :add-role="addRole"
      :get-role="getRole"
      :update-role="updateRole"
      :resources="resources"
      v-model="showDialogRole">
    </dialog-role>
    <dialog-user
      @add="handleUserAddSuccess"
      @update="handleUserUpdateSuccess"
      :id="userId"
      :get-user="getUser"
      :add-user="addUser"
      :get-zyz="getZyz"
      :update-user="updateUser"
      :roles="roles"
      v-model="showDialogUser">
    </dialog-user>
  </div>
</template>

<script>
import DialogRole from './dialog-role'
import DialogUser from './dialog-user'
export default {
  name: 'QlUserManage',
  components: {
    DialogRole,
    DialogUser
  },
  props: {
    // 资源列表
    resources: Array,
    // 获取专业组树
    getZyz: Function,
    fetchRole: Function,
    findUser: Function,
    addRole: Function,
    updateRole: Function,
    addUser: Function,
    getUser: Function,
    getRole: Function,
    updateUser: Function,
    deleteRole: Function,
    deleteUser: Function
  },
  data () {
    return {
      loading: false,
      roleList: [],
      roleId: null,
      userId: null,
      showDialogRole: false,
      showDialogUser: false
    }
  },
  computed: {
    roles () {
      return this.roleList.filter(item => item.roleId !== 'default')
    }
  },
  mounted () {
    this.loading = false
    this.fetchRole().then(data => {
      this.roleList = data.map(item => {
        return {
          ...item,
          userList: [],
          loaded: false
        }
      })
      this.roleList.push({
        roleId: 'default',
        roleType: 'default',
        roleName: '默认角色(无关联角色用户)',
        userList: [],
        loaded: false
      })
      this.loading = false
    }).catch(_ => {
      this.loading = false
    })
  },
  methods: {
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
          let deleteRole = await this.deleteRole(roleId)
          if (deleteRole) {
            list.splice(index, 1)
            let newUsers = await this.findUser()
            list = list.map(item => {
              if (item.roleId === 'default') {
                return {
                  ...item,
                  userList: newUsers,
                  loaded: true
                }
              }
              return item
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleRoleAddSuccess (data) {
      this.roleList.unshift({
        ...data,
        userList: [],
        loaded: true
      })
    },
    handleRoleUpdateSuccess (data) {
      this.roleList.forEach(item => {
        if (item.roleId === data.roleId) {
          item.roleName = data.roleName
        }
      })
    },
    handleUserAdd () {
      this.userId = null
      this.showDialogUser = true
    },
    handleUserAddSuccess (data) {
      this.roleList.forEach(item => {
        if (data.roleIdList.indexOf(item.roleId) > -1) {
          item.userList.push(data)
        }
      })
    },
    handleUserUpdateSuccess (data) {
      this.roleList.forEach(item => {
        if (data.roleIdList.indexOf(item.roleId) > -1) {
          item.userList.forEach(userItem => {
            if (userItem.userId === data.userId) {
              userItem.userName = data.userName
            }
          })
        } else {
          item.userList.forEach((userItem, userIndex) => {
            if (userItem.userId === data.userId) {
              item.userList.splice(userIndex, 1)
            }
          })
        }
      })
    },
    handleUserEdit (userId) {
      if (!this.hasEditRight) {
        return
      }
      this.userId = userId
      this.showDialogUser = true
    },
    handleUserDelete (userId, list, index) {
      this.confirmDelete('确认删除该用户？').then(_ => {
        this.deleteUser(userId).then(data => {
          this.roleList.forEach(item => {
            item.userList.forEach((userItem, userIndex, list) => {
              if (userItem.userId === userId) {
                list.splice(userIndex, 1)
              }
            })
          })
        })
      })
    },
    handleCollapseChange (activeName) {
      let activeItem = this.roleList.find(item => item.roleId === activeName)
      let roleId = activeName === 'default' ? null : activeName
      if (activeItem && !activeItem.loaded) {
        this.findUser(roleId).then(data => {
          activeItem.userList = data
          activeItem.loaded = true
        })
      }
    }
  }
}
</script>
<style lang="scss">
.ql-user-manage {
  &__top {
    .el-button-group {
      float: right;
    }
  }
  &__item-action {
    float: right;
    padding-right: 10px;
  }
}
</style>
