const Application = require('spectron').Application;
const assert = require('assert');
// const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');

// construct paths
const baseDir = path.join(__dirname, '..');
const electronBinary = path.join(baseDir, 'node_modules', '.bin', 'electron');

const sleep = time => new Promise(r => setTimeout(r, time));

describe('Application launch', function () {
    this.timeout(10000);

    const app = new Application({
        path: electronBinary,
        args: [baseDir],
    });

    before(() => app.start());

    after(() => app.stop());

    it('shows an initial window', function () {
        return app.client.getWindowCount().then(function (count) {
          assert.equal(count, 1)
        });
    });

    
    

})