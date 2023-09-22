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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitUriLabelProviderContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const uri_1 = require("@theia/core/lib/common/uri");
const git_resource_1 = require("./git-resource");
let GitUriLabelProviderContribution = class GitUriLabelProviderContribution {
    constructor(labelProvider) {
        this.labelProvider = labelProvider;
    }
    canHandle(element) {
        if (element instanceof uri_1.default && element.scheme === git_resource_1.GIT_RESOURCE_SCHEME) {
            return 20;
        }
        return 0;
    }
    getLongName(uri) {
        return this.labelProvider.getLongName(this.toFileUri(uri).withoutQuery().withoutFragment());
    }
    getName(uri) {
        return this.labelProvider.getName(this.toFileUri(uri)) + this.getTagSuffix(uri);
    }
    getIcon(uri) {
        return this.labelProvider.getIcon(this.toFileUri(uri));
    }
    affects(uri, event) {
        const fileUri = this.toFileUri(uri);
        return event.affects(fileUri) || event.affects(fileUri.withoutQuery().withoutFragment());
    }
    toFileUri(uri) {
        return uri.withScheme('file');
    }
    getTagSuffix(uri) {
        if (uri.query) {
            return ` (${uri.query})`;
        }
        else {
            return '';
        }
    }
};
GitUriLabelProviderContribution = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(label_provider_1.LabelProvider)),
    __metadata("design:paramtypes", [label_provider_1.LabelProvider])
], GitUriLabelProviderContribution);
exports.GitUriLabelProviderContribution = GitUriLabelProviderContribution;
//# sourceMappingURL=git-uri-label-contribution.js.map