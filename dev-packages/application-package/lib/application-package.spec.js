"use strict";
// *****************************************************************************
// Copyright (C) 2020 Maksim Ryzhikov and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const temp = require("temp");
const fs = require("fs-extra");
const path = require("path");
const application_package_1 = require("./application-package");
const application_props_1 = require("./application-props");
const sinon = require("sinon");
const track = temp.track();
const sandbox = sinon.createSandbox();
describe('application-package', function () {
    after(() => {
        sandbox.restore();
        track.cleanupSync();
    });
    it('should print warning if user set unknown target in package.json and use browser as a default value', function () {
        const warn = sandbox.stub(console, 'warn');
        const root = createProjectWithTarget('foo');
        const applicationPackage = new application_package_1.ApplicationPackage({ projectPath: root });
        assert.deepStrictEqual(applicationPackage.target, application_props_1.ApplicationProps.ApplicationTarget.browser);
        assert.deepStrictEqual(warn.called, true);
    });
    it('should set target from package.json', function () {
        const target = 'electron';
        const root = createProjectWithTarget(target);
        const applicationPackage = new application_package_1.ApplicationPackage({ projectPath: root });
        assert.deepStrictEqual(applicationPackage.target, target);
    });
    it('should prefer target from passed options over target from package.json', function () {
        const pckTarget = 'electron';
        const optTarget = 'browser';
        const root = createProjectWithTarget(pckTarget);
        const applicationPackage = new application_package_1.ApplicationPackage({ projectPath: root, appTarget: optTarget });
        assert.deepStrictEqual(applicationPackage.target, optTarget);
    });
    function createProjectWithTarget(target) {
        const root = track.mkdirSync('foo-project');
        fs.writeFileSync(path.join(root, 'package.json'), `{"theia": {"target": "${target}"}}`);
        return root;
    }
});
//# sourceMappingURL=application-package.spec.js.map