<template>
  <div class="ql-select-tag">
    <div class="ql-select-tag__selected">
      <el-tag
        :key="item.id"
        closable
        type="success"
        @close="handleTagClose(item.id)"
        v-for="item in selectedList">
        {{item.tag}}
      </el-tag>
      <el-button size="mini" icon="el-icon-plus" @click="showDialog = true">添加标签</el-button>
    </div>
    <ql-dialog append-to-body title="选择标签" :visible="showDialog" :before-close="handleClose">
      <el-input class="ql-select-tag__search" v-model="keywords" placeholder="输入关键字" suffix-icon="el-iconnn-search"></el-input>
      <el-tabs tab-position="left">
        <el-tab-pane
          :key="group.typeId"
          :label="group.type"
          class="ql-select-tag__pane"
          v-for="group in tagList">
          <el-button
            :key="item.id"
            size="small"
            :type="item.selected ? 'success' : ''"
            @click="handleSelect(group, item)"
            v-for="item in group.dataList">{{item.tag}}</el-button>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button @click="showDialog = false">关闭</el-button>
      </div>
    </ql-dialog>
  </div>
</template>

<script>
import {queryTags} from '@/api/tags'
import uniqBy from 'lodash/uniqBy'
export default {
  name: 'QlSelectTag',
  model: {
    prop: 'selected',
    event: 'selected-change'
  },
  props: {
    selected: Array
  },
  data () {
    return {
      tagList: [],
      keywords: '',
      tagCacheList: [],
      showDialog: false
    }
  },
  computed: {
    selectedList () {
      let result = []
      this.tagList.forEach(group => {
        result = result.concat(group.dataList.filter(tag => tag.selected))
      })
      return uniqBy(result, 'id')
    }
  },
  watch: {
    selectedList (list) {
      this.$emit('selected-change', list.map(val => val.id))
    },
    selected (list) {
      if (list && this.tagList.length) {
        this.tagList.forEach(group => {
          group.dataList.forEach(tag => {
            tag.selected = list.indexOf(tag.id) > -1
          })
        })
      }
    },
    keywords (val) {
      const v = val.trim().toLowerCase()
      const matchTag = (item) => {
        return item.tag.toLowerCase().indexOf(v) > -1
      }
      if (v === '') {
        this.tagList = this.tagCacheList
      } else {
        this.tagList = this.tagCacheList.filter(group => {
          return group.dataList.some(matchTag)
        })
        // this.tagList.forEach(group => {
        //   group.dataList = group.dataList.filter(matchTag)
        // })
      }
    }
  },
  mounted () {
    queryTags().then(data => {
      this.tagList = this.tagCacheList = data.map(item => {
        item.dataList = item.dataList.map(tag => {
          return {
            ...tag,
            selected: this.selected.indexOf(tag.id) > -1
          }
        })
        return item
      })
    })
  },
  methods: {
    handleSelect (group, item) {
      item.selected = !item.selected
      if (!group.multiSelected) {
        group.dataList.forEach(tag => {
          if (tag.id !== item.id) {
            tag.selected = false
          }
        })
      }
    },
    handleClose () {
      this.showDialog = false
    },
    handleTagClose (id) {
      this.tagList.forEach(group => {
        group.dataList.forEach(tag => {
          if (tag.id === id) {
            tag.selected = false
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/mixins/mixins.scss";
@import "../../assets/scss/common/var.scss";
@include b(select-tag){
  @include e(search) {
    width: 300px;
    margin-bottom: 22px;
    margin-left:135px;
  }
  @include e(pane) {
    .el-button {
      margin-right: 10px;
      margin-bottom: 6px;
    }
    .el-button+.el-button {
      margin-left: 0;
    }
  }
}
.el-tabs__item.is-left{
  background:#e1f5fe;
  margin-bottom:1px;
  color:#01579b;
  &.is-active{
    background: #40c4ff;
    color:white;
  }
}
</style>
