var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');

//task sass transform scss in css
gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss') // All files .scss
	.pipe(sass())
    .pipe(gulp.dest('app/css'))	// transform .css in the folder app/css
	.pipe(browserSync.reload({ // reload browser 
	stream : true
	}))
});

//create web server at the /app folder 
gulp.task('browserSync',function(){
	browserSync({
		server : {
			baseDir : 'app'
		},
	})
});

//task watch files
gulp.task('watch', gulp.parallel('browserSync', 'sass', function(){
	gulp.watch('app/scss/**/*.scss',gulp.series('sass'));
	//reload browser when a html or js file is updated
	gulp.watch('app/*.html',browserSync.reload);
	gulp.watch('app/js/**/*.js',browserSync.reload);
}));


//task optimization & minify
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref()) //concatenation
	.pipe(gulpif('*.js', uglify())) // minify
    .pipe(gulp.dest('dist'))

});


