const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');
const through = require('through2');

const project = ts.createProject('tsconfig.json', {
	declaration: true
});

gulp.task('preclean', function() {
	return Promise.all([
		del('dist', { force: true }),
		del('types', { force: true })
	]);
});

gulp.task('compile', function() {
	return gulp.src('src/**/*.ts')
		.pipe(project())
		.pipe(gulp.dest('dist'));
});

gulp.task('typings', function() {
	return gulp.src('dist/**/*.d.ts')
		.pipe(gulp.dest('types'));
});

gulp.task('typings:privatize', function() {
	return gulp.src('types/**/*.d.ts')
		.pipe(through.obj(function(file, encoding, callback) {
			let t = file.clone();
			t.contents = Buffer.from(t.contents.toString().replace(/^[\t ]*private[\t ]+_.+[\t ]*;[\t ]*\r?\n/gm, '')); // meh
			callback(null, t);
		}))
		.pipe(gulp.dest('types'));
});

gulp.task('postclean', function() {
	return del([
		'dist/**/*.d.ts',
		'types/helpers/http.d.ts',
		'types/util/'
	]);
});

gulp.task('build', gulp.series(
	'preclean',
	'compile',
	'typings',
	'typings:privatize',
	'postclean'
));
