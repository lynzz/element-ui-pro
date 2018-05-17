<template>
  <el-collapse class="ql-category cqb-collapse" @change="handleCollapseChange" accordion>
    <el-collapse-item
      class="ql-category__item"
      v-for="(item, index) in categoryList"
      :name="item[keyMap.pid]"
      :key="index">
      <template slot="title">
        {{item[keyMap.pname]}}
        <span class="ql-category__item-action">
          <el-button type="primary" size="mini" icon="el-icon-edit-outline" @click.stop="handleParentEdit(item)">
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click.stop="handleParentDelete(categoryList, item, index)">
          </el-button>
        </span>
      </template>
      <ql-tag
        :key="childIndex"
        closable
        @close="handleChildDelete(item[keyMap.children], childItem, childIndex)"
        v-for="(childItem, childIndex) in item[keyMap.children]">
        <span @click="handleChildEdit(item, childItem)">{{childItem[keyMap.name]}}</span>
      </ql-tag>
      <el-button size="mini" class="newtag" @click="handleChildAdd(item)" icon="el-icon-plus">添加标签</el-button>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import ConfirmDelete from '@/mixins/confirm-delete'
export default {
  name: 'QlCategory',
  mixins: [ConfirmDelete],
  props: {
    data: {
      type: Array
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    keyMap: {
      type: Object,
      default () {
        return {
          children: 'dataList',
          pid: 'typeId',
          pname: 'type',
          id: 'id',
          name: 'tag'
        }
      }
    }
  },
  data () {
    return {
      categoryList: this.data
    }
  },
  watch: {
    data (val) {
      this.categoryList = val || []
    }
  },
  methods: {
    handleCollapseChange (activeName) {
      // let activeItem = this.roleList.find(item => item.roleId === activeName)
      // let roleId = activeName === 'default' ? null : activeName
      // if (activeItem && !activeItem.loaded) {
      //   this.findUser(roleId).then(data => {
      //     activeItem.userList = data
      //     activeItem.loaded = true
      //   })
      // }
      this.$emit('collapse-change', activeName)
    },
    handleChildEdit (item, subItem) {
      this.$emit('child-update', item, subItem)
    },
    handleChildDelete (list, item, index) {
      let msg = item.times ? '存在关联到该标签的实验室,确认要删除该标签及关联信息' : '确定删除标签'
      this.confirmDelete(msg).then(() => {
        this.$emit('child-delete', list, item, index)
      })
    },
    handleChildAdd (item) {
      this.$emit('child-add', item)
    },
    handleParentEdit (item) {
      this.$emit('parent-update', item)
    },
    handleParentDelete (list, item, index) {
      this.confirmDelete('确定删除分类').then(() => {
        this.$emit('parent-delete', list, item, index)
      })
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/mixins/mixins.scss";
@import "../../assets/scss/common/var.scss";
@include b(category){
  &.cqb-collapse{
    @include e(item) {
      position: relative;
      margin-top:4px;
      .el-collapse-item__header{
        background: #e1f5fe;
        font-size: 16px;
        padding-left:15px;
        border:1px solid #d1e8f3;
        &.is-active{
            background: #4fc3f7;
            color:white;
        }
      }
      .el-collapse-item__content {
        padding:15px 15px 10px;
        border:1px solid #d1e8f3;
        border-top:none;
      }
      .el-tag {
        margin: 0 6px 6px 0;
        background:#0091ea;
        color:white;
        i{
          color:white;
        }
        &:hover{
        background: rgba($--color-primary,1);
        }
      }
      .newtag{
        background: rgba($--color-success,.9);
        color:white;
        &:hover{
        background: rgba($--color-success,1);
        }
      }
    }
    @include e(item-action) {
      position: absolute;
      right: 30px;
      top: 0px;
    }
  }

}

</style>
