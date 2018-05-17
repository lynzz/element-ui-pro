<template>
  <div class="ql-select-message">
    <div class="ql-select-message__current" v-show="!showCustom">
      <el-select v-model="currentValue">
        <el-option
          :key="msg.content"
          :value="msg.content"
          v-for="msg in msgList"></el-option>
      </el-select>
      <el-button type="success" @click="showCustom = true">自定义消息模板</el-button>
    </div>
    <div class="ql-select-message__custom" v-show="showCustom">
      <el-input ref="textarea" type="textarea" v-model="customMsg"></el-input>
      <div class="ql-select-message__btns">
        <el-button type="success" @click="handleSave" size="small">保存为模板</el-button>
        <el-button size="small" @click="showCustom = false">选择已有消息模板</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {queryMsgTpl, addMsgTpl} from '@/api/message'
import emitter from '@/mixins/emitter'
export default {
  name: 'QlSelectMessage',
  mixins: [emitter],
  model: {
    prop: 'selected',
    event: 'selected-change'
  },
  props: {
    selected: [Number, String]
  },
  data () {
    return {
      currentValue: this.selected || '',
      customMsg: '',
      showCustom: false,
      msgList: []
    }
  },
  watch: {
    selected (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('selected-change', val)
      this.dispatch('ElFormItem', 'el.form.change', val)
    },
    customMsg (val) {
      this.$emit('selected-change', val)
    }
  },
  mounted () {
    queryMsgTpl({
      pageNo: 1,
      pageSize: 1000
    }).then(data => {
      this.msgList = data.data
    })
  },
  methods: {
    handleSave () {
      if (this.customMsg.trim() === '') {
        this.$refs.textarea.focus()
        return
      }
      if (this.msgList.indexOf(this.customMsg) > -1) {
        this.$message.error('消息模板已存在，请重新输入')
        return
      }
      addMsgTpl(this.customMsg).then(data => {
        this.msgList.push({
          content: this.customMsg
        })
        this.currentValue = this.customMsg
        this.showCustom = false
        this.customMsg = ''
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/mixins/mixins.scss";
@import "../../assets/scss/common/var.scss";
@include b(select-message){
  @include e(btns) {
    margin-top: 16px;
  }
}
</style>
