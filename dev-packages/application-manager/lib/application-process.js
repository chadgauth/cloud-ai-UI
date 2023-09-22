"use strict";
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
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
exports.ApplicationProcess = void 0;
const path = require("path");
const fs = require("fs-extra");
const cp = require("child_process");
class ApplicationProcess {
    constructor(pck, binProjectPath) {
        this.pck = pck;
        this.binProjectPath = binProjectPath;
        this.defaultOptions = {
            cwd: this.pck.projectPath,
            env: process.env
        };
    }
    spawn(command, args, options) {
        return cp.spawn(command, args || [], Object.assign({}, this.defaultOptions, options));
    }
    fork(modulePath, args, options) {
        return cp.fork(modulePath, args, Object.assign({}, this.defaultOptions, options));
    }
    canRun(command) {
        return fs.existsSync(this.resolveBin(command));
    }
    run(command, args, options) {
        const commandProcess = this.spawnBin(command, args, options);
        return this.promisify(command, commandProcess);
    }
    spawnBin(command, args, options) {
        const binPath = this.resolveBin(command);
        return this.spawn(binPath, args, options);
    }
    resolveBin(command) {
        const commandPath = path.resolve(this.binProjectPath, 'node_modules', '.bin', command);
        return process.platform === 'win32' ? commandPath + '.cmd' : commandPath;
    }
    promisify(command, p) {
        return new Promise((resolve, reject) => {
            p.stdout.on('data', data => this.pck.log(data.toString()));
            p.stderr.on('data', data => this.pck.error(data.toString()));
            p.on('error', reject);
            p.on('close', (code, signal) => {
                if (signal) {
                    reject(new Error(`${command} exited with an unexpected signal: ${signal}.`));
                    return;
                }
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`${command} exited with an unexpected code: ${code}.`));
                }
            });
        });
    }
}
exports.ApplicationProcess = ApplicationProcess;
//# sourceMappingURL=application-process.js.map