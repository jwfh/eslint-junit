/* global jest, describe, it, expect, process */
/* eslint-disable no-sync, no-unused-vars */

const constants = require('../constants/index'); // eslint-disable-line

describe('getOptions', () => {
    it('should get defaults', () => {
        const getOptions = require('../utils/getOptions');
        expect(JSON.stringify(getOptions())).toBe(JSON.stringify(constants.DEFAULT_OPTIONS));
    });

    it('should get from env vars', () => {
        const getOptions = require('../utils/getOptions');
        process.env.ESLINT_JUNIT_CLASSNAME = 'test';
        expect(getOptions().classNameTemplate).toBe('test');
    });

    it('should get from package.json', () => {
        const getOptions = require('../utils/getOptions');
        jest.mock(`${process.cwd()}/package.json`, () => ({ 'eslint-junit': { titleTemplate: 'test' } }));
        expect(getOptions().classNameTemplate).toBe('test');
    });
});
