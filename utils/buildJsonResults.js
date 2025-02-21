const stripAnsi = require('strip-ansi'); // eslint-disable-line

const buildTemplate = function buildTemplate(template, obj) {
    return template.replace(/{([^{}]*)}/g, (capture) => {
        const key = capture.slice(1, capture.length - 1);

        return obj.hasOwnProperty(key)
            ? obj[key]
            : '';
    });
};

module.exports = function buildJsonResults(report, appDirectory, options) {
    // Generate a single XML file for all jest tests
    const jsonResults = { testsuites: [{ _attr: { name: options.suiteName } }] };

    // Iterate through outer testResults (test suites)
    report.forEach((suite) => {
    // Skip empty test suites
        if (suite.messages.length <= 0) {
            return;
        }

        // Add <testsuite /> properties
        const testSuite = {
            testsuite: [
                {
                    _attr: {
                        // not supported
                        errors: suite.errorCount,
                        failures: suite.fixableErrorCount,
                        name: suite.filePath.replace(appDirectory, ''),
                        skipped: suite.warningCount,
                        tests: suite.errorCount + suite.warningCount,
                        time: 1,
            'timestamp': (new Date()).toISOString().slice(0, -5) // eslint-disable-line
                    },
                },
            ],
        };

        if (options.condensed) {
            const obj = {
                ...suite,
                fileName: suite.filePath.replace(appDirectory, ''),
            };
            const testCase = {
                testcase: [
                    {
                        _attr: {
                            classname: buildTemplate(options.classNameTemplate, obj),
                            name: buildTemplate(options.titleTemplate, obj),
                            time: 1,
                        },
                    },
                ],
            };
            const addTag = function addTag(type) {
                testCase.testcase.push({
                    [type]: suite.messages.map((tc) => stripAnsi(buildTemplate(options.bodyTemplate, {
                        ...obj,
                        severityWord: ((severity) => {
                            switch (severity) {
                                case 1:
                                    return 'WARN';
                                case 2:
                                    return 'FAIL';
                            }
                        })(tc.severity),
                        ...tc,
                    }))).join('\n'),
                });
            };

            

            // Write out all failure messages as <failure> tags
            // Nested underneath <testcase> tag
            if (obj.severity === 2 || options.condensed) {
                addTag('failure');
            }

            // Write out a <skipped> tag if test is skipped
            // Nested underneath <testcase> tag
            if (!options.condensed && obj.severity === 1) {
                addTag('skipped');
            }

            testSuite.testsuite.push(testCase);
        } else {
            suite.messages.forEach((tc) => {
                const obj = {
                    ...suite,
                    fileName: suite.filePath.replace(appDirectory, ''),
                    severityWord: ((severity) => {
                        switch (severity) {
                            case 1:
                                return 'WARN';
                            case 2:
                                return 'FAIL';
                        }
                    })(tc.severity),
                    ...tc,
                };

                const testCase = {
                    testcase: [
                        {
                            _attr: {
                                classname: buildTemplate(options.classNameTemplate, obj),
                                name: buildTemplate(options.titleTemplate, obj),
                                time: 1,
                            },
                        },
                    ],
                };

                const addTag = function addTag(type) {
                    testCase.testcase.push({ [type]: stripAnsi(buildTemplate(options.bodyTemplate, obj)) });
                };

                // Write out all failure messages as <failure> tags
                // Nested underneath <testcase> tag
                if (obj.severity === 2 || (options.treatWarnAsFail && obj.severity === 1)) {
                    addTag('failure');
                }

                // Write out a <skipped> tag if test is skipped
                // Nested underneath <testcase> tag
                if (!options.treatWarnAsFail && obj.severity === 1) {
                    addTag('skipped');
                }

                testSuite.testsuite.push(testCase);
            });
        }

        jsonResults.testsuites.push(testSuite);
    });

    return jsonResults;
};
