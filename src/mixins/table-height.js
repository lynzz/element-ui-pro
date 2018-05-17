export default {
  data () {
    return {
      tableMaxHeight: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.tableMaxHeight =
        document.body.clientHeight -
        document.querySelector('.ql-layout__header').offsetHeight -
        document.querySelector('.ql-search__header').offsetHeight -
        document.querySelector('.ql-search__tools-top').offsetHeight -
        document.querySelector('.el-table__header-wrapper').offsetHeight -
        document.querySelector('.ql-search__footer').offsetHeight -
        document.querySelector('.ql-layout__footer').offsetHeight -
        70
    })
  }
}
