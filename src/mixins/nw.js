export default {
  data () {
    return {
      isMaxNw: false,
      nwWin: window.nw ? window.nw.Window.get() : null
    }
  },
  computed: {
    isNw () {
      return typeof window.nw !== 'undefined'
    },
    appName () {
      return window.nw ? window.nw.Window.get().title : '昆涞 2.0'
    }
  },
  created () {
    if (this.nwWin) {
      // 任务栏最大化情况
      this.nwWin.on('maximize', () => {
        this.isMaxNw = true
      })
      this.nwWin.on('restore', () => {
        this.isMaxNw = false
      })
    }
  },
  methods: {
    enterFullscreen () {
      if (this.isNw) {
        this.nwWin.enterFullscreen()
      }
    },
    leaveFullscreen () {
      if (this.isNw) {
        this.nwWin.leaveFullscreen()
      }
    },
    handleMinNw () {
      this.nwWin.minimize()
    },
    handleMaxNw () {
      this.isMaxNw = !this.isMaxNw
      if (this.isMaxNw) {
        this.nwWin.maximize()
      } else {
        this.nwWin.restore()
      }
    },
    handleCloseNw () {
      this.$confirm('确认退出程序', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '留下',
        type: 'info'
      }).then(() => {
        this.nwWin.close(true)
      })
    }
  }
}
