///@ts-check
'use strict';

var gulp = require('gulp');
var colors = require('ansi-colors');
var path = require('path');

var taskLog = require('./log/task-log');
var error = require('./log/error');
var rainbow = require('./log/rainbow');

var typescript = require('./tasks/typescript');
var javascript = require('./tasks/javascript');
var wxts = require('./tasks/wxts');
var wxss = require('./tasks/wxss');
var json = require('./tasks/json');
var wxml = require('./tasks/wxml');
var image = require('./tasks/image');
var npm = require('./tasks/npm');
var copy = require('./tasks/copy');
var clean = require('./tasks/clean');

const $config = require('./config').default;

exports.$gulp = gulp;
/**
 * @param {string[]} tasks
 */
exports.$execute = function (tasks) {
    $config.src = path.normalize($config.src);
    $config.dist = path.normalize($config.dist);
    gulp.series(tasks)(function (err) {
        if (err) {
            console.error(JSON.stringify(err));
            throw err;
        }
    });
}

// compile
gulp.task('typescript', typescript.build($config));
gulp.task('javascript', javascript.build($config, ['js']));
gulp.task('js', gulp.parallel('typescript', 'javascript'));

gulp.task('wxts', wxts.build($config));
gulp.task('wxjs', javascript.build($config, ['wxs']));
gulp.task('wxs', gulp.parallel('wxts', 'wxjs'));

gulp.task('wxss', wxss.build($config));
gulp.task('wxml', wxml.build($config));
gulp.task('json', json.build($config));
gulp.task('image', image.build($config));
gulp.task('copy', copy.build($config));
gulp.task('npm', npm.build($config));

// watch
gulp.task('typescript-watch', typescript.watch($config));
gulp.task('javascript-watch', javascript.watch($config, ['js']));
gulp.task('js-watch', gulp.parallel('typescript-watch', 'javascript-watch'));

gulp.task('wxts-watch', wxts.watch($config));
gulp.task('wxjs-watch', javascript.watch($config, ['wxs']));
gulp.task('wxs-watch', gulp.parallel('wxts-watch', 'wxjs-watch'));

gulp.task('wxss-watch', wxss.watch($config));
gulp.task('wxml-watch', wxml.watch($config));
gulp.task('json-watch', json.watch($config));
gulp.task('image-watch', image.watch($config));
gulp.task('copy-watch', copy.watch($config));
gulp.task('npm-watch', npm.watch($config));

gulp.task('clean', clean.build($config));

//编译项目
gulp.task('compile', gulp.series(
    taskLog(rainbow("↓↓↓↓↓↓"), 'start compile:', colors.cyan.bold.underline($config.src), '→', colors.green.bold.underline($config.dist), rainbow("↓↓↓↓↓↓")),
    gulp.parallel('js', 'wxs', 'wxss', 'wxml', 'json', 'image', 'copy', 'npm'),
    taskLog(rainbow("↑↑↑↑↑↑"), colors.greenBright.bold('√ All compilation tasks done!'), rainbow("↑↑↑↑↑↑"))
))
// 重新生成文件
gulp.task('build', gulp.series('clean', 'compile'));
// 监测文件修改
gulp.task('watch', gulp.series(
    gulp.parallel('js-watch', 'wxs-watch', 'wxss-watch', 'wxml-watch', 'json-watch', 'image-watch', 'copy-watch', 'npm-watch'),
    taskLog(rainbow('All watching tasks started ...')))
);

//开发模式
gulp.task('dev', gulp.series('build', 'watch'));

gulp.on('error', console.trace);
gulp.on('error', error('gulp'));

