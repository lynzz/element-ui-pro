<template>
  <ql-dialog class="ql-dialog-message" width="80%" :visible="showDialog" :before-close="handleClose" title="消息详情">
    <el-alert type="info" show-icon style="margin-bottom: 10px" :closable="false" title="提示" :description="message"></el-alert>
    <table-report-details :data="tableData"></table-report-details>
    <div class="ql-dialog-message__footer">
      {{deptName}} {{createTime}}
    </div>
    <div slot="footer" v-if="!readed">
      <el-button type="primary" @click="handleSave">确认已读</el-button>
    </div>
  </ql-dialog>
</template>

<script>
import TableReportDetails from '@/components/table-report-details'
import Dialog from '@/mixins/dialog'
import {EventBus} from '@/utils/event-bus'
import {markMsg} from '@/api/message'
export default {
  name: 'QlDialogMessage',
  mixins: [Dialog],
  components: {
    TableReportDetails
  },
  props: {
    model: Object
  },
  computed: {
    tableData () {
      if (this.model && this.model.relaData) {
        const relaData = JSON.parse(this.model.relaData)
        return Array.isArray(relaData) ? relaData : relaData.tableData
      }
      return []
    },
    deptName () {
      if (this.model && this.model.createDeptName) {
        return this.model.createDeptName
      } else {
        return ''
      }
    },
    createTime () {
      if (this.model && this.model.createTime) {
        return this.model.createTime
      } else {
        return ''
      }
    },
    readed () {
      if (this.model) {
        return this.model.status === 2
      }
      return false
    },
    message () {
      if (this.model && this.model.message) {
        return this.model.message
      } else {
        return ''
      }
    }
  },
  // watch: {
  //   model: {
  //     deep: true,
  //     handler () {

  //     }
  //   }
  // },
  data () {
    return {
    }
  },
  methods: {
    handleSave () {
      markMsg(this.model.id).then(data => {
        EventBus.$emit('ql.message.marked')
        this.showDialog = false
      })
    },
    handleCellClass ({row, column, rowIndex, columnIndex}) {
      let highlight = (column.property === 'skStatus' && row.skStatus) ||
        (column.property === 'reported' && !row.reported) ||
        (column.property === 'cvTotal' && row.cvTotal > row.cvValue) ||
        (column.property === 'cvCurrent' && row.cvCurrent > row.cvValue) ||
        (column.property === 'cvRecent' && row.cvRecent > row.cvValue)

      return highlight ? 'is-danger' : ''
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/scss/mixins/mixins.scss";
@import "../../assets/scss/common/var.scss";
@include b(dialog-message){
  .el-table thead {
    color: $--color-text-regular;
  }
  @include e(footer) {
    text-align: right;
    line-height: 24px;
    padding-top: 10px;
  }
}
</style>
