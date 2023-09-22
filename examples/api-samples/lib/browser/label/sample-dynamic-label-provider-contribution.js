"use strict";
// *****************************************************************************
// Copyright (C) 2019 Arm and others.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleDynamicLabelProviderContribution = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const label_provider_1 = require("@theia/core/lib/browser/label-provider");
const uri_1 = require("@theia/core/lib/common/uri");
const core_1 = require("@theia/core");
let SampleDynamicLabelProviderContribution = class SampleDynamicLabelProviderContribution extends label_provider_1.DefaultUriLabelProviderContribution {
    constructor() {
        super();
        this.isActive = false;
        this.onDidChangeEmitter = new core_1.Emitter();
        this.x = 0;
        const outer = this;
        setInterval(() => {
            if (this.isActive) {
                outer.x++;
                outer.fireLabelsDidChange();
            }
        }, 1000);
    }
    canHandle(element) {
        if (this.isActive && element.toString().includes('test')) {
            return 30;
        }
        return 0;
    }
    toggle() {
        this.isActive = !this.isActive;
        this.fireLabelsDidChange();
    }
    fireLabelsDidChange() {
        this.onDidChangeEmitter.fire({
            affects: (element) => element.toString().includes('test')
        });
    }
    getUri(element) {
        return new uri_1.default(element.toString());
    }
    getIcon(element) {
        const uri = this.getUri(element);
        const icon = super.getFileIcon(uri);
        if (!icon) {
            return this.defaultFileIcon;
        }
        return icon;
    }
    getName(element) {
        const uri = this.getUri(element);
        if (this.isActive && uri.toString().includes('test')) {
            return super.getName(uri) + '-' + this.x.toString(10);
        }
        else {
            return super.getName(uri);
        }
    }
    getLongName(element) {
        const uri = this.getUri(element);
        return super.getLongName(uri);
    }
    get onDidChange() {
        return this.onDidChangeEmitter.event;
    }
};
SampleDynamicLabelProviderContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SampleDynamicLabelProviderContribution);
exports.SampleDynamicLabelProviderContribution = SampleDynamicLabelProviderContribution;
//# sourceMappingURL=sample-dynamic-label-provider-contribution.js.map