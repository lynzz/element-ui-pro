const config = [
  {
    label: '面板',
    groupName: 'dashboard',
    icon: 'data-montior',
    code1: 'dashboard',
    children: [
      {
        label: '分析页',
        name: 'analysis',
        code1: 'dashboard:analysis'
      },
      {
        label: '工作台',
        name: 'workplace',
        code1: 'dashboard:workplace'
      }
    ]
  },
  {
    label: '组件',
    groupName: 'component',
    icon: 'component',
    children: [
      {
        label: '高级查询',
        name: 'search',
        code1: 'dashboard:analysis'
      }
    ]
  }
]

export default config
