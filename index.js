/* global process */

const xml = require('xml'); // eslint-disable-line
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

const buildJsonResults = require('./utils/buildJsonResults');
const getOptions = require('./utils/getOptions');

/*
  At the end of ALL of the linting this method is called
  It's responsible for generating a single eslint-junit.xml file which
  Represents the status of the test runs

  Intended output (junit XML) documentation here:
  http://help.catchsoftware.com/display/ET/JUnit+Format
*/
module.exports = (report) => {
    const options = getOptions();
    const jsonResults = buildJsonResults(report, fs.realpathSync(process.cwd()), options);

    // Ensure output path exists
    mkdirp.sync(path.dirname(options.output));

    // Write data to file
    fs.writeFileSync(options.output, xml(jsonResults, { indent: '  ' }));

    return '';
};
