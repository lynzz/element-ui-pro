import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters(['rightCode']),
    // 有编辑权限时，也可添加
    hasEditRight () {
      return this.rightCode.indexOf('op:edit') > -1 || true
    },
    hasDeleteRight () {
      return this.rightCode.indexOf('op:delete') > -1
    },

    hasAuditRight () {
      return this.rightCode.indexOf('op:audit') > -1
    }
  }
}
