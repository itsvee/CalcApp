const Application = require('spectron').Application;
const assert = require('assert');
// const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');

// construct paths
const baseDir = path.join(__dirname, '..');
const electronBinary = path.join(baseDir, 'node_modules', '.bin', 'electron');

const sleep = time => new Promise(r => setTimeout(r, time));

describe('Application launch', function () {
    this.timeout(150000);

    const app = new Application({
        path: electronBinary,
        args: [baseDir],
    });

    before(() => app.start());

    after(() => app.stop());

    it('shows an initial window', function () {
        return app.client.getWindowCount().then(function (count) {
          assert.equal(count, 1);
        });
    });

    it('plus number', function () {
        let aInput = Math.floor(Math.random() * 1001) - 1000;
        let bInput = Math.floor(Math.random() * 1001) - 1000;
        let result = aInput + bInput;
        return app.client
            .setValue('#a-value', aInput)
            .setValue('#b-value', bInput)
            .click('#plus')
            .getValue('#result').then(function(value) {
                assert.equal(value, result.toString());
            });
    });

    it('minus number', function () {
        let aInput = Math.floor(Math.random() * 1001) - 1000;
        let bInput = Math.floor(Math.random() * 1001) - 1000;
        let result = aInput - bInput;
        return app.client
            .setValue('#a-value', aInput)
            .setValue('#b-value', bInput)
            .click('#minus')
            .getValue('#result').then(function(value) {
                assert.equal(value, result.toString());
            });
    });

    it('multiply number', function () {
        let aInput = Math.floor(Math.random() * 1001) - 1000;
        let bInput = Math.floor(Math.random() * 1001) - 1000;
        let result = aInput * bInput;
        return app.client
            .setValue('#a-value', aInput)
            .setValue('#b-value', bInput)
            .click('#multiply')
            .getValue('#result').then(function(value) {
                assert.equal(value, result.toString());
            });
    });

    it('divide number', function () {
        let aInput = Math.floor(Math.random() * 1001) - 1000;
        let bInput = Math.floor(Math.random() * 1001) - 1000;
        let result = aInput / bInput;
        return app.client
            .setValue('#a-value', aInput)
            .setValue('#b-value', bInput)
            .click('#divide')
            .getValue('#result').then(function(value) {
                assert.equal(value, result.toString());
            });
    });

    it('power number', function () {
        let aInput = Math.floor(Math.random() * 1001) - 1000;
        let bInput = Math.floor(Math.random() * 1001) - 1000;
        let result = Math.pow(aInput, bInput);
        return app.client
            .setValue('#a-value', aInput)
            .setValue('#b-value', bInput)
            .click('#power')
            .getValue('#result').then(function(value) {
                assert.equal(value, result.toString());
            });
    });

});

