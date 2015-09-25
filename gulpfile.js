var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    mocha = require('gulp-mocha');

gulp.task('default', function() {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {
      PORT: 3000
    },
    ignore: ['./node_modules']
  })
  .on('restart', function() {
    console.log('Restarting...');
  });
});

gulp.task('test', function() {
  gulp.src('tests/*.js', {read: false})
      .pipe(mocha({reporter: 'nyan'}))
})
