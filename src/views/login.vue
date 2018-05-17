<template>
  <div class="ql-login">
    <div class="ql-login__title">
    </div>
    <el-card class="ql-login__form">
      <div slot="header">
        <i class="iconfont icon-login"></i> 欢迎登录
      </div>
      <el-form :model="userForm" ref="form" :rules="rules">
        <el-form-item prop="userName">
          <el-input prefix-icon="iconfont icon-user-o" v-model="userForm.userName" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-lock" type="password" v-model="userForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="kaptcha">
          <el-input style="width:100px" v-model="userForm.kaptcha" placeholder="验证码" :maxlength="4"></el-input>
          <img class="ql-login__img" :src="codeUrl" alt="" @click="refreshCode">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="submited" @click.prevent="login" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="footer">北京科临易检信息技术有限公司</div>
  </div>
</template>

<script>
import md5 from 'md5'
import {EventBus} from '@/utils/event-bus'
import {validCodeUrl} from '@/api/auth'
import {PASSPORD_HASH} from '@/utils/const'
export default {
  data () {
    return {
      submited: false,
      codeUrl: validCodeUrl(Date.now()),
      userForm: {
        userName: '',
        kaptcha: '',
        password: ''
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名'}
        ],
        password: [
          {required: true, message: '请输入密码'}
        ],
        kaptcha: [
          {required: false, message: '请输入验证码'}
        ]
      }
    }
  },

  mounted () {

  },

  methods: {
    refreshCode () {
      this.codeUrl = validCodeUrl(Date.now())
      this.userForm.kaptcha = ''
    },
    login () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let {userName, password, kaptcha} = this.userForm
          this.submited = true
          password = md5(`${password}${PASSPORD_HASH}`)
          this.$store.dispatch('login', {userName, password, kaptcha}).then(() => {
            this.submited = false
            EventBus.$emit('ql.login.success')
            this.$router.push({path: this.$route.query.redirect || '/'})
          }).catch(() => {
            this.refreshCode()
            this.submited = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "../assets/scss/mixins/mixins.scss";

@include b(login) {
  background: #f0f2f5;
  width: 100%;
  min-height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  background-size:cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @include e(form) {
    width: 368px;
      .el-card__body{
        .el-form{
          margin:20px 30px 0;
          .el-input{
            height:45px;
            .el-input__prefix{
              .el-input__icon{
                font-size: 20px;
                position: relative;
                top:-5px;
              }
            }
          }
        }
      }
  }
  @include e(title){
    width:350px;
    height:90px;
    text-align: center;
    position: absolute;
    // top:120px;
  }
  @include e(img) {
    height: 36px;
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
  .footer{
    position: absolute;
    bottom:30px;
    left:50%;
    width:300px;
    text-align: center;
    margin-left:-150px;
    color:white;
    color: rgba(255, 255, 255, 0.5);
  }
}

</style>
