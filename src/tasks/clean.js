///@ts-check
//@ts-check
'use strict';

const path = require('path');

const rm = require('rimraf');
const colors = require('ansi-colors');

const log = require('../log/logger');
const color = require('../log/color');

exports.build = function (config) {
    return function (cb) {
        const projectJson = path.join(config.dist, 'project.config.json')
        const appJson = path.join(config.dist, 'app.json')
        log(color('clean:'),  colors.dim('delete'), colors.bold(config.dist), colors.dim.gray(`[exclude: ${projectJson},${appJson}]`));
        rm(`${config.dist}/**/*`, {
            glob: {
                ignore: [projectJson, appJson]
            }
        }, cb);
        // return (config.dist);
    };
}
