<template>
  <div>
    <ql-search :fetch="queryLab" :columns="columns">

    </ql-search>
  </div>
</template>

<script>
import {queryLab} from '@/api/demo'
export default {
  name: 'Search',
  data () {
    return {
      queryLab,
      columns: [{
        label: 'ID',
        prop: 'id'
      }, {
        label: '实验名称',
        prop: 'labName'
      }, {
        label: '创建时间',
        prop: 'createDate'
      }, {
        label: '操作',
        render: (h, params) => {
          return h('div', [
            h('el-button', {
              props: {
                type: 'text'
              }
            }, '修改')
          ])
        }
      }]
    }
  },
  methods: {
    fetchData () {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: [{

            }],
            pageNo: 1,
            pageSize: 1,
            totalCount: 10
          })
        }, 0)
      })
    }
  }
}
</script>
