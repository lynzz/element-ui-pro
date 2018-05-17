<template>
  <div class="ql-search">
    <div class="ql-search__header" v-if="hasQuery">
      <slot name="toggle"></slot>
      <div
        class="ql-search--simple"
        :class="{
          'is-right': hasAdvanced
        }"
        v-show="simple">
        <el-form :inline="true" :model="model" ref="simpleForm">
          <slot name="simple"></slot>
          <el-form-item label="开始时间" v-if="showDaterange && !hasAdvanced">
            <el-date-picker v-model="startTime" id="startTime" :type="dateType" :format="displayDateFormat" :picker-options="startPickerOptions" :editable="false" :clearable="false" placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" v-if="showDaterange && !hasAdvanced">
            <el-date-picker v-model="endTime" id="endTime" :type="dateType" :format="displayDateFormat" :picker-options="endPickerOptions" :editable="false" :clearable="false" placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" native-type="submit" type="primary" @click.prevent="handleSearch">搜索</el-button>
            <el-button v-if="hasReset" @click="handleResetForm('simpleForm')">重置</el-button>
            <el-button type="text" v-if="hasAdvanced" @click="simple = false">展开 <i class="el-icon-arrow-down"></i></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="ql-search--advanced" v-show="!simple">
        <el-form :model="model" ref="advancedForm" :label-width="labelWidth">
           <slot name="advanced"></slot>
           <el-row>
             <el-col :span="8">
               <el-form-item label="开始时间" v-if="showDaterange">
                <el-date-picker v-model="startTime" id="startTime" :type="dateType" :format="displayDateFormat" :picker-options="startPickerOptions" :editable="false" :clearable="false" placeholder="开始时间">
                </el-date-picker>
              </el-form-item>
             </el-col>
             <el-col :span="8">
                <el-form-item label="结束时间" v-if="showDaterange">
                  <el-date-picker v-model="endTime" id="endTime" :type="dateType" :format="displayDateFormat" :picker-options="endPickerOptions" :editable="false" :clearable="false" placeholder="结束时间">
                  </el-date-picker>
                </el-form-item>
             </el-col>
           </el-row>
           <div class="ql-search__btns">
             <el-button type="primary" @click.prevent="handleSearch" native-type="submit" icon="el-icon-search">搜索</el-button>
              <el-button @click="handleResetForm('advancedForm')">重置</el-button>
              <el-button type="text" @click="simple = true">收起 <i class="el-icon-arrow-up"></i></el-button>
           </div>
        </el-form>
      </div>
    </div>
    <div
      :class="{
        'is-right': toolsPosition === 'right',
        'is-left': toolsPosition === 'left'
      }"
      class="ql-search__tools-top">
      <slot name="topTools"></slot>
    </div>
    <div class="ql-search__body" v-loading="loading">
      <el-table :data="tableData" v-if="columns" border>
        <el-table-column
          :prop="col.prop"
          :label="col.label"
          :key="col.prop"
          v-for="col in columns">
          <template v-if="col.render" slot-scope="props">
            <cell-render
              :render="col.render"
              :row="props.row"
              :index="props.index"
              :column="col">
            </cell-render>
          </template>
        </el-table-column>
      </el-table>
      <slot></slot>
    </div>
    <div class="ql-search__footer">
      <div class="ql-search__tools-bottom">
        <slot name="bottomTools"></slot>
      </div>
      <el-pagination
        v-if="pageCount > 0 && showPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import datetime from '@/mixins/datetime'
import CellRender from './cell-render'
const DEFAULT_KEY_MAPS = {
  list: 'data',
  startTime: 'startTime',
  endTime: 'endTime',
  totalCount: 'total'
}
export default {
  name: 'QlSearch',
  components: {
    CellRender
  },
  mixins: [datetime],
  model: {
    prop: 'result',
    event: 'result-change'
  },
  props: {
    // 查询结果
    result: Array,
    columns: Array,
    // 搜索列表类型，table/card
    type: {
      type: String,
      default: 'table'
    },
    // 顶部按钮位置
    toolsPosition: {
      type: String,
      default: 'left'
    },
    // 是否轮询搜索
    polling: Boolean,
    // 轮询的间隔时间
    interval: {
      type: Number,
      default: 10000
    },
    // 搜索之前处理
    beforeSearch: Function,
    // 请求接口函数，返回 promise
    fetch: Function,
    labelWidth: {
      type: String,
      default: '100px'
    },
    // 有重置按钮，针对简易搜索
    hasReset: {
      type: Boolean,
      default: false
    },
    // 显示分页
    showPage: {
      default: true
    },
    // 显示日期范围
    showDaterange: {
      default: true
    },

    // 日期类型，默认天
    dateType: {
      type: String,
      default: 'date'
    },

    // 搜索条件变化时，是否重置 当前页码
    resetCurrentPage: {
      type: Boolean,
      default: true
    },
    // 每页显示的默认条数
    defaultPageSize: {
      type: Number,
      default: 20
    },

    // 可选的每页条数
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 40, 50]
      }
    },

    keyMaps: {
      type: Object,
      default () {
        return DEFAULT_KEY_MAPS
      }
    },
    // 是否自动渲染数据，嵌入在弹框时 有需手动渲染情况
    autorender: {
      type: Boolean,
      default: true
    },
    // 处理要查询的数据
    postData: Function,

    // 搜索表单, 如果不是在 slot 创建的 el-form ,直接把要查询的字段放在 model 里即可
    model: Object
  },
  computed: {
    hasQuery () {
      return this.showDaterange || this.$slots.simple || this.$slots.advanced || this.$slots.toggle
    },
    hasAdvanced () {
      return this.$slots.advanced
    },
    pageCount () {
      return Math.ceil(this.totalCount / this.pageSize)
    },
    isTable () {
      return this.type === 'table'
    },
    displayDateFormat () {
      if (this.dateType === 'date') {
        return 'yyyy年MM月dd日'
      } else if (this.dateType === 'month') {
        return 'yyyy年MM月'
      }
    },
    submitDateFormat () {
      if (this.dateType === 'date') {
        return 'YYYYMMDD'
      } else if (this.dateType === 'month') {
        return 'YYYYMM'
      }
    }
  },
  watch: {
    model: {
      deep: true,
      handler (val) {
        if (this.$slots.toggle) {
          this.handleSearch()
        }
      }
    }
  },
  data () {
    return {
      loading: false,
      // 控制高级和简单搜索切换
      simple: true,
      // 当前页面
      currentPage: 1,
      // 每页显示的条数
      pageSize: 20,
      // 总数据数
      totalCount: 0,
      tableData: [],
      timer: null
    }
  },
  mounted () {
    this.pageSize = this.defaultPageSize
    if (typeof this.beforeSearch === 'function') {
      this.beforeSearch()
    }
    this.autorender && this.fetchData()
    if (this.polling) {
      this.startPolling()
    }
  },
  methods: {
    startPolling () {
      this.stopPolling()
      this.timer = window.setInterval(() => {
        this.currentPage = 1
        this.fetchData()
      }, this.interval)
    },
    stopPolling () {
      this.timer && window.clearInterval(this.timer)
    },
    refresh () {
      this.currentPage = 1
      this.fetchData()
    },
    handleSearch () {
      if (this.resetCurrentPage) {
        this.currentPage = 1
      }
      this.fetchData()
      if (this.polling) {
        this.startPolling()
      }
    },
    fetchData () {
      let pageNo = this.currentPage
      let pageSize = this.pageSize
      let currForm = {...this.model, pageNo, pageSize}
      let keyMaps = Object.assign({}, DEFAULT_KEY_MAPS, this.keyMaps)
      this.loading = true

      if (this.showDaterange) {
        let startTime = +moment(this.startTime).format(this.submitDateFormat)
        let endTime = +moment(this.endTime).format(this.submitDateFormat)
        currForm[keyMaps.startTime] = startTime
        currForm[keyMaps.endTime] = endTime
      }

      if (typeof this.postData === 'function') {
        currForm = this.postData(currForm)
      }
      this.fetch(currForm).then(data => {
        const listData = data[keyMaps.list]
        this.tableData = listData
        this.loading = false
        this.totalCount = data[keyMaps.totalCount]
        this.$emit('search', listData)
        this.$emit('result-change', data[keyMaps.list])
      }).catch(() => {
        this.$emit('result-change', [])
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.fetchData()
    },
    // el-form-item 需设置 prop
    handleResetForm (form) {
      this.$refs[form].resetFields()
      this.$emit('reset')
    },
    resetForm () {
      if (this.simple) {
        this.$refs.simpleForm.resetFields()
      } else {
        this.$refs.advancedForm.resetFields()
      }
    }
  },
  destroyed () {
    if (this.polling) {
      this.stopPolling()
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/mixins/mixins.scss";
@import "../../assets/scss/mixins/utils.scss";
@import "../../assets/scss/common/var.scss";

@include b(search) {
  .el-table {
    box-shadow: $--box-shadow-light-1;
  }
  @include m(simple) {
    .el-form-item {
      margin-bottom: 0;
    }
    @include when(right) {
      text-align: right;
    }
  }

  @include e(header) {
    padding: 10px;
    border-radius: 3px;
  }

  @include e(btns) {
    text-align: right;
  }

  @include e(tools-top) {
    &:empty {
      display: none;
    }
    @include when(right) {
      position: absolute;
      right: 0;
      top: 0;
    }
    @include when(left) {
      padding: 6px 0;
    }
  }

  @include e(tools-bottom) {
    float: left;
  }

  @include e(body) {
    margin-top: 10px;
  }

  @include e(footer){
    text-align: center;
    padding: 10px 0;
    @include utils-clearfix;
  }
}

</style>
