"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.TaskWatcher = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const event_1 = require("@theia/core/lib/common/event");
let TaskWatcher = class TaskWatcher {
    constructor() {
        this.onTaskCreatedEmitter = new event_1.Emitter();
        this.onTaskExitEmitter = new event_1.Emitter();
        this.onDidStartTaskProcessEmitter = new event_1.Emitter();
        this.onDidEndTaskProcessEmitter = new event_1.Emitter();
        this.onOutputProcessedEmitter = new event_1.Emitter();
        this.onBackgroundTaskEndedEmitter = new event_1.Emitter();
    }
    getTaskClient() {
        const newTaskEmitter = this.onTaskCreatedEmitter;
        const exitEmitter = this.onTaskExitEmitter;
        const taskProcessStartedEmitter = this.onDidStartTaskProcessEmitter;
        const taskProcessEndedEmitter = this.onDidEndTaskProcessEmitter;
        const outputProcessedEmitter = this.onOutputProcessedEmitter;
        const backgroundTaskEndedEmitter = this.onBackgroundTaskEndedEmitter;
        return {
            onTaskCreated(event) {
                newTaskEmitter.fire(event);
            },
            onTaskExit(event) {
                exitEmitter.fire(event);
            },
            onDidStartTaskProcess(event) {
                taskProcessStartedEmitter.fire(event);
            },
            onDidEndTaskProcess(event) {
                taskProcessEndedEmitter.fire(event);
            },
            onDidProcessTaskOutput(event) {
                outputProcessedEmitter.fire(event);
            },
            onBackgroundTaskEnded(event) {
                backgroundTaskEndedEmitter.fire(event);
            }
        };
    }
    get onTaskCreated() {
        return this.onTaskCreatedEmitter.event;
    }
    get onTaskExit() {
        return this.onTaskExitEmitter.event;
    }
    get onDidStartTaskProcess() {
        return this.onDidStartTaskProcessEmitter.event;
    }
    get onDidEndTaskProcess() {
        return this.onDidEndTaskProcessEmitter.event;
    }
    get onOutputProcessed() {
        return this.onOutputProcessedEmitter.event;
    }
    get onBackgroundTaskEnded() {
        return this.onBackgroundTaskEndedEmitter.event;
    }
};
TaskWatcher = __decorate([
    (0, inversify_1.injectable)()
], TaskWatcher);
exports.TaskWatcher = TaskWatcher;
//# sourceMappingURL=task-watcher.js.map