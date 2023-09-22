"use strict";
// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
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
exports.DefaultTerminalProfileService = exports.DefaultProfileStore = exports.NULL_PROFILE = exports.UserTerminalProfileStore = exports.ContributedTerminalProfileStore = exports.TerminalProfileService = void 0;
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
exports.TerminalProfileService = Symbol('TerminalProfileService');
exports.ContributedTerminalProfileStore = Symbol('ContributedTerminalProfileStore');
exports.UserTerminalProfileStore = Symbol('UserTerminalProfileStore');
exports.NULL_PROFILE = {
    start: async () => { throw new Error('you cannot start a null profile'); }
};
let DefaultProfileStore = class DefaultProfileStore {
    constructor() {
        this.onAddedEmitter = new core_1.Emitter();
        this.onRemovedEmitter = new core_1.Emitter();
        this.profiles = new Map();
        this.onAdded = this.onAddedEmitter.event;
        this.onRemoved = this.onRemovedEmitter.event;
    }
    registerTerminalProfile(id, profile) {
        this.profiles.set(id, profile);
        this.onAddedEmitter.fire([id, profile]);
    }
    unregisterTerminalProfile(id) {
        this.profiles.delete(id);
        this.onRemovedEmitter.fire(id);
    }
    hasProfile(id) {
        return this.profiles.has(id);
    }
    getProfile(id) {
        return this.profiles.get(id);
    }
    get all() {
        return [...this.profiles.entries()];
    }
};
DefaultProfileStore = __decorate([
    (0, inversify_1.injectable)()
], DefaultProfileStore);
exports.DefaultProfileStore = DefaultProfileStore;
let DefaultTerminalProfileService = class DefaultTerminalProfileService {
    constructor(...stores) {
        this.defaultProfileIndex = 0;
        this.order = [];
        this.onAddedEmitter = new core_1.Emitter();
        this.onRemovedEmitter = new core_1.Emitter();
        this.onAdded = this.onAddedEmitter.event;
        this.onRemoved = this.onRemovedEmitter.event;
        this.stores = stores;
        for (const store of this.stores) {
            store.onAdded(e => {
                if (e[1] === exports.NULL_PROFILE) {
                    this.handleRemoved(e[0]);
                }
                else {
                    this.handleAdded(e[0]);
                }
            });
            store.onRemoved(id => {
                if (!this.getProfile(id)) {
                    this.handleRemoved(id);
                }
                else {
                    // we may have removed a null profile
                    this.handleAdded(id);
                }
            });
        }
    }
    handleRemoved(id) {
        const index = this.order.indexOf(id);
        if (index >= 0 && !this.getProfile(id)) {
            // the profile was removed, but it's still in the `order` array
            this.order.splice(index, 1);
            this.defaultProfileIndex = Math.max(0, Math.min(this.order.length - 1, index));
            this.onRemovedEmitter.fire(id);
        }
    }
    handleAdded(id) {
        const index = this.order.indexOf(id);
        if (index < 0) {
            this.order.push(id);
            this.onAddedEmitter.fire(id);
        }
    }
    get defaultProfile() {
        const id = this.order[this.defaultProfileIndex];
        if (id) {
            return this.getProfile(id);
        }
        return undefined;
    }
    setDefaultProfile(id) {
        const profile = this.getProfile(id);
        if (!profile) {
            throw new Error(`Cannot set default to unknown profile '${id}' `);
        }
        this.defaultProfileIndex = this.order.indexOf(id);
    }
    getProfile(id) {
        for (const store of this.stores) {
            if (store.hasProfile(id)) {
                const found = store.getProfile(id);
                return found === exports.NULL_PROFILE ? undefined : found;
            }
        }
        return undefined;
    }
    getId(profile) {
        for (const [id, p] of this.all) {
            if (p === profile) {
                return id;
            }
        }
    }
    get all() {
        return this.order.filter(id => !!this.getProfile(id)).map(id => [id, this.getProfile(id)]);
    }
};
DefaultTerminalProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], DefaultTerminalProfileService);
exports.DefaultTerminalProfileService = DefaultTerminalProfileService;
//# sourceMappingURL=terminal-profile-service.js.map