/* global process */
const path = require('path'); // eslint-disable-line
const fs = require('fs');

const constants = require('../constants/index');

const getEnvOptions = function getEnvOptions() {
    const options = {};

    Object.keys(constants.ENVIRONMENT_CONFIG_MAP).forEach((name) => {
        if (process.env[name]) {
            options[constants.ENVIRONMENT_CONFIG_MAP[name]] = process.env[name];
        }
    });

    return options;
};

const getAppOptions = function getAppOptions(pathToResolve) {
    const initialPath = pathToResolve;

    // Find nearest package.json by traversing up directories until /
    while (pathToResolve !== path.sep) {
        const pkgpath = path.join(pathToResolve, 'package.json');
    if (fs.existsSync(pkgpath)) { // eslint-disable-line
            let options = (require(pkgpath) || {})['eslint-junit'];

            if (Reflect.apply(Object.prototype.toString, options, []) !== '[object Object]') {
                options = {};
            }

            return options;
        }
    pathToResolve = path.dirname(pathToResolve); // eslint-disable-line
    }

    throw new Error(`Unable to locate package.json starting at ${initialPath}`);
};

module.exports = function getOptions() {
    const appOptions = getAppOptions(process.cwd());
    const condensed = 'condensed' in appOptions && appOptions.condensed;
    return {
        ...constants.DEFAULT_OPTIONS, ...(condensed ? constants.OPTIONS_CONDENSED : {}), ...appOptions, ...getEnvOptions(),
    };
};
