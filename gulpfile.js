const gulp = require('gulp');
const ts = require('gulp-typescript');
const del = require('del');

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

gulp.task('postclean', function() {
	return del('dist/**/*.d.ts');
});

gulp.task('build', gulp.series(
	'preclean',
	'compile',
	'typings',
	'postclean'
));
