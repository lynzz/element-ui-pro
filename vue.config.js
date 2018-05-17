module.exports = {
  lintOnSave: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000/api',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
