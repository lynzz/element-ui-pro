const gulp = require('gulp')
const gulpCopy = require('gulp-copy')
const et = require('element-theme')

gulp.task('theme', () => {
  et.run({
    config: 'src/assets/scss/common/var.scss',
    out: 'theme',
    minimize: true
  })
})

gulp.task('fonts', () => {
  return gulp
    .src(['./theme/fonts/**'])
    .pipe(gulpCopy('./src/assets/theme-default', { prefix: 1 }))
})

gulp.task('css', () => {
  return gulp
    .src(['./theme/index.css'])
    .pipe(gulpCopy('./src/assets/theme-default', { prefix: 2 }))
})

gulp.task('copy', ['css', 'fonts'])
