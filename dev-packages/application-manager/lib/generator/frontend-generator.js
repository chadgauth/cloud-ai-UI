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
exports.FrontendGenerator = void 0;
/* eslint-disable @typescript-eslint/indent */
const os_1 = require("os");
const abstract_generator_1 = require("./abstract-generator");
const fs_1 = require("fs");
class FrontendGenerator extends abstract_generator_1.AbstractGenerator {
    async generate(options) {
        await this.write(this.pck.frontend('index.html'), this.compileIndexHtml(this.pck.targetFrontendModules));
        await this.write(this.pck.frontend('index.js'), this.compileIndexJs(this.pck.targetFrontendModules, this.pck.frontendPreloadModules));
        await this.write(this.pck.frontend('secondary-window.html'), this.compileSecondaryWindowHtml());
        await this.write(this.pck.frontend('secondary-index.js'), this.compileSecondaryIndexJs(this.pck.secondaryWindowModules));
        if (this.pck.isElectron()) {
            await this.write(this.pck.frontend('preload.js'), this.compilePreloadJs());
        }
    }
    compileIndexPreload(frontendModules) {
        const template = this.pck.props.generator.config.preloadTemplate;
        if (!template) {
            return '';
        }
        // Support path to html file
        if ((0, fs_1.existsSync)(template)) {
            return (0, fs_1.readFileSync)(template).toString();
        }
        return template;
    }
    compileIndexHtml(frontendModules) {
        return `<!DOCTYPE html>
<html lang="en">

<head>${this.compileIndexHead(frontendModules)}
</head>

<body>
    <div class="theia-preload">${this.compileIndexPreload(frontendModules)}</div>
    <script type="text/javascript" src="./bundle.js" charset="utf-8"></script>
</body>

</html>`;
    }
    compileIndexHead(frontendModules) {
        return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>${this.pck.props.frontend.config.applicationName}</title>`;
    }
    compileIndexJs(frontendModules, frontendPreloadModules) {
        return `\
// @ts-check
${this.ifBrowser("require('es6-promise/auto');")}
require('reflect-metadata');
require('setimmediate');
const { Container } = require('inversify');
const { FrontendApplicationConfigProvider } = require('@theia/core/lib/browser/frontend-application-config-provider');

FrontendApplicationConfigProvider.set(${this.prettyStringify(this.pck.props.frontend.config)});

${this.ifMonaco(() => `
self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        return './editor.worker.js';
    }
}`)}

function load(container, jsModule) {
    return Promise.resolve(jsModule)
        .then(containerModule => container.load(containerModule.default));
}

async function preload(parent) {
    const container = new Container();
    container.parent = parent;
    try {
${Array.from(frontendPreloadModules.values(), jsModulePath => `\
        await load(container, import('${jsModulePath}'));`).join(os_1.EOL)}
        const { Preloader } = require('@theia/core/lib/browser/preload/preloader');
        const preloader = container.get(Preloader);
        await preloader.initialize();
    } catch (reason) {
        console.error('Failed to run preload scripts.');
        if (reason) {
            console.error(reason);
        }
    }
}

module.exports = (async () => {
    const { messagingFrontendModule } = require('@theia/core/lib/${this.pck.isBrowser()
            ? 'browser/messaging/messaging-frontend-module'
            : 'electron-browser/messaging/electron-messaging-frontend-module'}');
    const container = new Container();
    container.load(messagingFrontendModule);
    await preload(container);
    const { FrontendApplication } = require('@theia/core/lib/browser');
    const { frontendApplicationModule } = require('@theia/core/lib/browser/frontend-application-module');    
    const { loggerFrontendModule } = require('@theia/core/lib/browser/logger-frontend-module');

    container.load(frontendApplicationModule);
    container.load(loggerFrontendModule);

    try {
${Array.from(frontendModules.values(), jsModulePath => `\
        await load(container, import('${jsModulePath}'));`).join(os_1.EOL)}
        await start();
    } catch (reason) {
        console.error('Failed to start the frontend application.');
        if (reason) {
            console.error(reason);
        }
    }

    function start() {
        (window['theia'] = window['theia'] || {}).container = container;
        return container.get(FrontendApplication).start();
    }
})();
`;
    }
    /** HTML for secondary windows that contain an extracted widget. */
    compileSecondaryWindowHtml() {
        return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Theia — Secondary Window</title>
    <style>
    html, body {
        overflow: hidden;
        -ms-overflow-style: none;
    }

    body {
        margin: 0;
    }

    html,
    head,
    body,
    .secondary-widget-root,
    #widget-host {
        width: 100% !important;
        height: 100% !important;
    }
    </style>
    <link rel="stylesheet" href="./secondary-window.css">
    <script>
    window.addEventListener('message', e => {
        // Only process messages from Theia main window
        if (e.source === window.opener) {
            // Delegate message to iframe
            document.getElementsByTagName('iframe').item(0).contentWindow.postMessage({ ...e.data }, '*');
        }
    });
    </script>
</head>

<body>
    <div id="widget-host"></div>
</body>

</html>`;
    }
    compileSecondaryIndexJs(secondaryWindowModules) {
        return `\
// @ts-check
require('reflect-metadata');
const { Container } = require('inversify');

module.exports = Promise.resolve().then(() => {
    const { frontendApplicationModule } = require('@theia/core/lib/browser/frontend-application-module');
    const container = new Container();
    container.load(frontendApplicationModule);
${Array.from(secondaryWindowModules.values(), jsModulePath => `\
    container.load(require('${jsModulePath}').default);`).join(os_1.EOL)}
});
`;
    }
    compilePreloadJs() {
        return `\
// @ts-check
${Array.from(this.pck.preloadModules.values(), path => `require('${path}').preload();`).join(os_1.EOL)}
`;
    }
}
exports.FrontendGenerator = FrontendGenerator;
//# sourceMappingURL=frontend-generator.js.map