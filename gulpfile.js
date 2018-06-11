var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');

//task sass transform scss in css
gulp.task('sass', function () {
	return gulp.src('app/scss/**/*.scss') // All files .scss
		.pipe(sass())
		.pipe(gulp.dest('app/css'))	// transform .css in the folder app/css
		.pipe(browserSync.reload({ // reload browser 
			stream: true
		}))
});

//create web server at the /app folder 
gulp.task('browserSync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
	})
});

//task watch files
gulp.task('watch', gulp.parallel('browserSync', 'sass', function () {
	gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
	//reload browser when a html or js file is updated
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
}));

//task optimization & minify
gulp.task('useref', function () {
	return gulp.src('app/*.html')
		.pipe(useref()) //concatenation
		.pipe(gulpif('*.css', cleanCSS())) //minify css files
		.pipe(gulpif('*.js', uglify())) // minify js files
		.pipe(gulp.dest('dist'))
});

//task minify pictures
gulp.task('images', function () {
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
		//picture cache
		.pipe(cache(imagemin({ interlaced: true })))
		.pipe(gulp.dest('dist/images'))
});

//task copy font
gulp.task('fonts', function () {
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

//clean files
gulp.task('clean', function (callback) {
	del('dist');
	return cache.clearAll(callback);
});
gulp.task('clean:dist', function () {
	return (del(['dist/**/*', '!dist/images', '!dist/images/**/*']))
});

//combine all tasks
gulp.task('build',
	gulp.series('clean:dist', gulp.parallel('sass', 'useref', 'images', 'fonts'))); //first task clean, and simultaneously sass,useref ...

gulp.task('default', gulp.parallel('sass', 'browserSync', 'watch')); // default to use only "gulp" without task
