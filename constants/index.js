/* global process */
const path = require('path'); // eslint-disable-line

module.exports = {
    DEFAULT_OPTIONS: {
        classNameTemplate: '{ruleId}',
        output: path.join(process.cwd(), './eslint-junit.xml'),
        suiteName: 'ESLint Style Test',
        titleTemplate: '{fileName} line {line}',
        bodyTemplate: '{message}',
        treatWarnAsFail: false,
    },
    OPTIONS_CONDENSED: {
        classNameTemplate: '{errorCount} errors',
        titleTemplate: '',
        bodyTemplate: '{line}:{column}  {severityWord}  {message}           {ruleId}',
        treatWarnAsFail: true,
    },
    ENVIRONMENT_CONFIG_MAP: {
        ESLINT_JUNIT_CLASSNAME: 'classNameTemplate',
        ESLINT_JUNIT_BODY: 'bodyTemplate',
        ESLINT_JUNIT_OUTPUT: 'output',
        ESLINT_JUNIT_TITLE: 'titleTemplate',
        ESLINT_SUITE_NAME: 'suiteName',
    },
};
