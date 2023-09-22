"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
exports.FileLocationMapper = exports.LocationWithoutSchemeMapper = exports.HttpsLocationMapper = exports.HttpLocationMapper = exports.LocationMapperService = exports.LocationMapper = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const uri_1 = require("@theia/core/lib/common/uri");
const browser_1 = require("@theia/core/lib/browser");
const types_1 = require("@theia/core/lib/common/types");
const contribution_provider_1 = require("@theia/core/lib/common/contribution-provider");
const mini_browser_environment_1 = require("./environment/mini-browser-environment");
/**
 * Contribution for the `LocationMapperService`.
 */
exports.LocationMapper = Symbol('LocationMapper');
/**
 * Location mapper service.
 */
let LocationMapperService = class LocationMapperService {
    async map(location) {
        const contributions = await this.prioritize(location);
        if (contributions.length === 0) {
            return this.defaultMapper()(location);
        }
        return contributions[0].map(location);
    }
    defaultMapper() {
        return location => `${new browser_1.Endpoint().httpScheme}//${location}`;
    }
    async prioritize(location) {
        const prioritized = await types_1.Prioritizeable.prioritizeAll(this.getContributions(), contribution => contribution.canHandle(location));
        return prioritized.map(p => p.value);
    }
    getContributions() {
        return this.contributions.getContributions();
    }
};
__decorate([
    (0, inversify_1.inject)(contribution_provider_1.ContributionProvider),
    (0, inversify_1.named)(exports.LocationMapper),
    __metadata("design:type", Object)
], LocationMapperService.prototype, "contributions", void 0);
LocationMapperService = __decorate([
    (0, inversify_1.injectable)()
], LocationMapperService);
exports.LocationMapperService = LocationMapperService;
/**
 * HTTP location mapper.
 */
let HttpLocationMapper = class HttpLocationMapper {
    canHandle(location) {
        return location.startsWith('http://') ? 1 : 0;
    }
    map(location) {
        return location;
    }
};
HttpLocationMapper = __decorate([
    (0, inversify_1.injectable)()
], HttpLocationMapper);
exports.HttpLocationMapper = HttpLocationMapper;
/**
 * HTTPS location mapper.
 */
let HttpsLocationMapper = class HttpsLocationMapper {
    canHandle(location) {
        return location.startsWith('https://') ? 1 : 0;
    }
    map(location) {
        return location;
    }
};
HttpsLocationMapper = __decorate([
    (0, inversify_1.injectable)()
], HttpsLocationMapper);
exports.HttpsLocationMapper = HttpsLocationMapper;
/**
 * Location mapper for locations without a scheme.
 */
let LocationWithoutSchemeMapper = class LocationWithoutSchemeMapper {
    canHandle(location) {
        return new uri_1.default(location).scheme === '' ? 1 : 0;
    }
    map(location) {
        return `http://${location}`;
    }
};
LocationWithoutSchemeMapper = __decorate([
    (0, inversify_1.injectable)()
], LocationWithoutSchemeMapper);
exports.LocationWithoutSchemeMapper = LocationWithoutSchemeMapper;
/**
 * `file` URI location mapper.
 */
let FileLocationMapper = class FileLocationMapper {
    canHandle(location) {
        return location.startsWith('file://') ? 1 : 0;
    }
    async map(location) {
        const uri = new uri_1.default(location);
        if (uri.scheme !== 'file') {
            throw new Error(`Only URIs with 'file' scheme can be mapped to an URL. URI was: ${uri}.`);
        }
        let rawLocation = uri.path.toString();
        if (rawLocation.charAt(0) === '/') {
            rawLocation = rawLocation.substring(1);
        }
        return this.miniBrowserEnvironment.getRandomEndpoint().getRestUrl().resolve(rawLocation).toString();
    }
};
__decorate([
    (0, inversify_1.inject)(mini_browser_environment_1.MiniBrowserEnvironment),
    __metadata("design:type", mini_browser_environment_1.MiniBrowserEnvironment)
], FileLocationMapper.prototype, "miniBrowserEnvironment", void 0);
FileLocationMapper = __decorate([
    (0, inversify_1.injectable)()
], FileLocationMapper);
exports.FileLocationMapper = FileLocationMapper;
//# sourceMappingURL=location-mapper-service.js.map