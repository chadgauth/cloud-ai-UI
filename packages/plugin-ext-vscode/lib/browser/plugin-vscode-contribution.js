"use strict";
// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginVSCodeContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const user_storage_uri_1 = require("@theia/userstorage/lib/browser/user-storage-uri");
const uri_components_1 = require("@theia/plugin-ext/lib/common/uri-components");
const delegating_file_system_provider_1 = require("@theia/filesystem/lib/common/delegating-file-system-provider");
let PluginVSCodeContribution = class PluginVSCodeContribution {
    registerFileSystemProviders(service) {
        this.mapSchemas(service, uri_components_1.Schemes.vscodeRemote, 'file');
        this.mapSchemas(service, uri_components_1.Schemes.userData, user_storage_uri_1.UserStorageUri.scheme);
    }
    mapSchemas(service, from, to) {
        service.onWillActivateFileSystemProvider(event => {
            if (event.scheme === from) {
                event.waitUntil((async () => {
                    const provider = await service.activateProvider(to);
                    service.registerProvider(from, new delegating_file_system_provider_1.DelegatingFileSystemProvider(provider, {
                        uriConverter: {
                            to: resource => resource.withScheme(to),
                            from: resource => resource.withScheme(from)
                        }
                    }));
                })());
            }
        });
    }
};
PluginVSCodeContribution = __decorate([
    (0, inversify_1.injectable)()
], PluginVSCodeContribution);
exports.PluginVSCodeContribution = PluginVSCodeContribution;
//# sourceMappingURL=plugin-vscode-contribution.js.map