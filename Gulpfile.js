var gulp = require('gulp')
var eslint = require('gulp-eslint')

function lint() {
	return gulp.src(['index.js'])
		.pipe(eslint())
		.pipe(eslint.formatEach())
}
exports.default = lint
