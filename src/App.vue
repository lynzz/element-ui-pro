<template>
  <div id="app">
    <router-view v-if="isLogin"></router-view>
    <el-container class="ql-layout__wrapper" v-else>
      <el-aside
        class="ql-layout__aside"
        :style="{
          width: asideWidth + 'px'
        }">
        <router-link class="ql-layout__logo" :to="{path: '/'}">
          <img src="./assets/img/logo.png" alt="">
          <h1 v-show="!isCollapse">Pro</h1>
        </router-link>
        <el-menu
          class="ql-layout__aside-menu"
          :router="true"
          :collapse="isCollapse"
          :default-active="activeIndex"
          theme="dark"
          text-color="#B5B8BF"
          mode="vertical">
          <template v-for="nav in menuList">
            <el-menu-item :index="nav.path" :key="nav.path" v-if="nav.name">
              <ql-icon :name="nav.icon"></ql-icon>
              <span slot="title">{{nav.label}}</span>
            </el-menu-item>
            <el-submenu popper-class="ql-layout__submenu" :index="nav.label" :key="nav.path" v-if="nav.children">
              <template slot="title">
                <ql-icon :name="nav.icon"></ql-icon>
                <span slot="title">{{nav.label}}</span>
              </template>
              <el-menu-item :index="subNav.path" v-for="subNav in nav.children" :key="subNav.name">{{subNav.label}}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="ql-layout__header">
          <ql-icon :name="isCollapse ? 'menu-unfold' : 'menu-fold'" @click="handleMenuToggle" class="ql-layout__header-toggle"></ql-icon>
          <el-breadcrumb separator="/">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
            <el-breadcrumb-item v-if="$route.meta.title">{{$route.meta.title}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="ql-layout__header-right">
            <el-dropdown @command="handleMessageCommand" class="ql-layout__header-dropdown">
              <span class="dropdown-link msg-prompt">
                <el-badge :value="msgCount" v-if="msgCount">
                  <ql-icon name="bell"></ql-icon>
                </el-badge>
                <ql-icon v-else name="bell"></ql-icon>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :key="index"
                  v-for="(item, index) in msgList"
                  :command="index">
                    {{item.message}}
                </el-dropdown-item>
                <el-dropdown-item command="empty" v-if="!msgList.length">
                  暂无消息
                </el-dropdown-item>
                <el-dropdown-item divided command="more"> 查看更多</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommand" class="ql-layout__header-dropdown">
              <span class="dropdown-link">
                {{userName}} <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="pwd"><i class="iconfont icon-lock"></i> 修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout"><i class="iconfont icon-logout"></i> 注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="ql-layout__main">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
        <el-footer height="30px" class="ql-layout__footer">
          @element-ui-pro
        </el-footer>
      </el-container>
    </el-container>
    <dialog-reset-pwd
      :id="userCode"
      id-key="userCode"
      :on-reset="changePwd"
      :reset="false"
      v-model="showDialogReset">
    </dialog-reset-pwd>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { mapGetters } from 'vuex'
import navConfig from './router/nav.config'
import DialogResetPwd from '@/components/dialog-reset-pwd/dialog-reset-pwd'
import { changePwd } from '@/api/auth'
import { getMsgCount, queryMsg } from '@/api/message'
import { EventBus } from '@/utils/event-bus'
const ASIDE_WIDTH_MINI = 64
const ASIDE_WIDTH_FULL = 230
export default {
  name: 'app',
  components: {
    DialogResetPwd
  },
  data () {
    return {
      changePwd,
      asideBgColor: '#495060',
      msgTimer: null,
      isCollapse: false,
      showDialogReset: false,
      showDialogMessage: false,
      msgCount: 0,
      currMsgData: null,
      msgList: [],
      // isNw: typeof window.nw !== 'undefined',
      transitionName: 'slide-left'
    }
  },

  computed: {
    ...mapGetters(['userName', 'userCode', 'permissions']),
    isLogin () {
      return this.$route.name === 'login'
    },
    activeIndex () {
      return this.$route.path
    },
    asideWidth () {
      return this.isCollapse ? ASIDE_WIDTH_MINI : ASIDE_WIDTH_FULL
    },
    menuList () {
      const checkCode = item => {
        return item.code ? this.permissions.indexOf(item.code) > -1 : true
      }
      let list = cloneDeep(navConfig).filter(checkCode)
      list.forEach(group => {
        if (group.children) {
          group.children = group.children.filter(checkCode)
        }
      })
      const getPath = (menu, groupName) => {
        menu.forEach(item => {
          const name = item.name
          let prefix = groupName ? `${groupName}/` : ''
          if (name) {
            item.path = `/${prefix}${name}`
          }
          if (item.children) {
            getPath(item.children, item.groupName)
          }
        })
        return menu
      }
      return getPath(list)
    }
  },

  mounted () {
    if (!this.isNw) {
      this.$confirm(
        '请安装使用客户端进行访问,否则部分功能将无法正常使用',
        '提示',
        {
          type: 'warning',
          center: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          cancelButtonText: '关闭',
          showConfirmButton: false
        }
      )
    }
    EventBus.$on('ql.login.success', () => {
      this.fetchMessage()
      this.autoUpdateMessage()
    })
    if (!this.isLogin) {
      // this.fetchMessage()
    }
    EventBus.$on('ql.message.marked', () => {
      this.fetchMessage()
    })
    EventBus.$on('ql.message.showDialog', data => {
      this.currMsgData = data
      this.showDialogMessage = true
    })
  },

  watch: {
    $route (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },

  methods: {
    fetchMessage () {
      getMsgCount().then(data => {
        this.msgCount = data
      })
      queryMsg({
        pageNo: 1,
        status: 1,
        pageSize: 5
      }).then(data => {
        this.msgList = data.data
      })
    },
    autoUpdateMessage () {
      this.fetchMessage()
      this.msgTimer = setInterval(() => {
        this.fetchMessage()
      }, 15 * 1000)
    },
    handleMenuToggle () {
      this.isCollapse = !this.isCollapse
    },
    handleMenuOpen () {
      this.asideWidth = ASIDE_WIDTH_FULL
    },
    handleMenuClose () {
      this.asideWidth = ASIDE_WIDTH_MINI
    },
    handleMessageCommand (cmd) {
      if (cmd === 'empty') return
      if (cmd === 'more') {
        this.$router.push({ name: 'message' })
      } else {
        this.currMsgData = this.msgList[cmd]
        this.showDialogMessage = true
      }
    },
    handleCommand (cmd) {
      if (cmd === 'logout') {
        this.$store.dispatch('logout').then(() => {
          clearInterval(this.msgTimer)
          this.$router.replace({ name: 'login' })
        })
      } else if (cmd === 'pwd') {
        this.showDialogReset = true
      }
    }
  }
}
</script>
<style lang="scss">
  @import './assets/scss/common/transition.scss';
  @import './assets/scss/common/var.scss';
  @import './assets/scss/mixins/utils.scss';

  $aside-bg-color: #495060;
  $submenu-bg-color: #363E50;
  $main-bg-color: #f0f2f5;
  $menu-item-height: 40px;
  body {
    margin: 0;
    padding: 0;
  }
  html,
  #app,
  body,
  .ql-layout__wrapper,
  .ql-layout__aside {
    height: 100vh;
  }
  .ql-layout {
    &__logo {
      height: $--header-height;
      line-height: $--header-height;
      display: block;
      overflow: hidden;
      img {
        display: inline-block;
        vertical-align: middle;
        height: 24px;
        width: 64px;
      }
      h1 {
        color: #fff;
        display: inline-block;
        vertical-align: middle;
        margin: 0 0 0 6px;
        font-size: 20px;
        font-weight: 550;
      }
    }
    &__header {
      align-items: center;
      position: relative;
      padding: 0;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      @include utils-clearfix;
      &-toggle {
        line-height: $--header-height;
        float: left;
        cursor: pointer;
        padding: 0 24px;
        font-size: 24px;
        transition: all 0.3s;
        &:hover {
          background: $--color-primary-light-9;
        }
      }
      .el-breadcrumb {
        line-height: $--header-height;
      }
      .el-breadcrumb__item:last-child .el-breadcrumb__inner {
        font-size: 16px;
      }
      &-right {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        .el-badge__content {
          border: 0;
          &.is-fixed {
            top: 50%;
            transform: translateY(-100%) translateX(100%);
          }
        }
      }
      &-dropdown {
        .dropdown-link {
          line-height: $--header-height;
          height: $--header-height;
          cursor: pointer;
          display: inline-block;
          padding: 0 12px;
          transition: all 0.3s;
          position: relative;
          &.msg-prompt {
            // position: relative;
            // // line-height: 60px;
            // width: 40px;
            // text-align: center;
            // height: 60px;
            // top: 0;
            i {
              font-size: 28px;
              color: rgba(255, 255, 255, 0.7);
            }
          }
          &:hover {
            background: $--color-primary-light-9;
          }
        }
      }
    }
    &__aside {
      box-shadow: 2px 0 6px rgba(0,21,41,.35);
      transition: width 0.3s;
      position: relative;
      z-index: 10;
      overflow: visible;
      background: $aside-bg-color;
      .el-menu {
        border-right: 0;
        background: $aside-bg-color;
        .el-submenu__title {
          &:hover {
            background: $aside-bg-color;
            color: #fff !important;
          }
        }
        .el-menu-item {
          height: $menu-item-height;
          line-height: $menu-item-height;
          background: $aside-bg-color;
          &:hover {
            color: #fff !important;
          }
        }
        .el-submenu:hover,
        .el-submenu__title:hover {
          color: #fff;
        }
        .el-submenu.is-active {
          color: white;
        }
        .el-menu-item.is-active {
          background-color: $--link-hover-color!important;
          color: white;
        }
      }
      .el-menu-item i {
        color: rgba(255, 255, 255, 0.9);
      }
      .el-submenu {
        .el-submenu__title {
          height: $menu-item-height;
          line-height: $menu-item-height;
        }
        &.is-active {
          color: #fff;
          & .el-submenu__title {
            color: #fff !important;
            background: $aside-bg-color;
          }
        }
        &.is-opened {
          .el-menu-item {
            background: $submenu-bg-color;
          }
        }
        i {
          color: rgba(255, 255, 255, 0.8);
        }
      }
      .footer {
        color: rgba(255, 255, 255, 0.5);
        bottom: 12px;
        position: absolute;
        left: 10px;
      }
    }
    &__main {
      background: $main-bg-color;
    }
    &__footer {
      text-align: center;
      background: $main-bg-color;
      color: $--color-primary;
      line-height: 30px;
    }
  }
</style>
