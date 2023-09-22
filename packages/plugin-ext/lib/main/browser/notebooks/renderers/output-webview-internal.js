"use strict";
// *****************************************************************************
// Copyright (C) 2023 TypeFox and others.
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
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputWebviewPreload = void 0;
;
;
async function outputWebviewPreload(ctx) {
    const theia = acquireVsCodeApi();
    const renderFallbackErrorName = 'vscode.fallbackToNextRenderer';
    function createEmitter(listenerChange = () => undefined) {
        const listeners = new Set();
        return {
            fire(data) {
                for (const listener of [...listeners]) {
                    listener.fn.call(listener.thisArg, data);
                }
            },
            event(fn, thisArg, disposables) {
                const listenerObj = { fn, thisArg };
                const disposable = {
                    dispose: () => {
                        listeners.delete(listenerObj);
                        listenerChange(listeners);
                    },
                };
                listeners.add(listenerObj);
                listenerChange(listeners);
                if (disposables) {
                    if ('push' in disposables) {
                        disposables.push(disposable);
                    }
                    else {
                        disposables.add(disposable);
                    }
                }
                return disposable;
            }
        };
    }
    ;
    const settingChange = createEmitter();
    class Output {
        constructor(output, items) {
            this.element = document.createElement('div');
            // padding for scrollbars
            this.element.style.paddingBottom = '10px';
            this.element.style.paddingRight = '10px';
            this.element.id = output.id;
            document.body.appendChild(this.element);
            this.allItems = items;
        }
        findItemToRender(preferredMimetype) {
            var _a;
            if (preferredMimetype) {
                const itemToRender = this.allItems.find(item => item.mime === preferredMimetype);
                if (itemToRender) {
                    return itemToRender;
                }
            }
            return (_a = this.renderedItem) !== null && _a !== void 0 ? _a : this.allItems[0];
        }
        clear() {
            var _a, _b, _c;
            (_b = (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.disposeOutputItem) === null || _b === void 0 ? void 0 : _b.call(_a, (_c = this.renderedItem) === null || _c === void 0 ? void 0 : _c.id);
            this.element.innerHTML = '';
        }
    }
    const outputs = new Map();
    class Renderer {
        constructor(data) {
            this.data = data;
            this.onMessageEvent = createEmitter();
        }
        receiveMessage(message) {
            this.onMessageEvent.fire(message);
        }
        disposeOutputItem(id) {
            var _a, _b;
            (_b = (_a = this.rendererApi) === null || _a === void 0 ? void 0 : _a.disposeOutputItem) === null || _b === void 0 ? void 0 : _b.call(_a, id);
        }
        async getOrLoad() {
            if (this.rendererApi) {
                return this.rendererApi;
            }
            const rendererModule = await __import(this.data.entrypoint.uri);
            this.rendererApi = await rendererModule.activate(this.createRendererContext());
            return this.rendererApi;
        }
        createRendererContext() {
            const context = {
                setState: newState => theia.setState({ ...theia.getState(), [this.data.id]: newState }),
                getState: () => {
                    const state = theia.getState();
                    return typeof state === 'object' && state ? state[this.data.id] : undefined;
                },
                getRenderer: async (id) => {
                    const renderer = renderers.getRenderer(id);
                    if (!renderer) {
                        return undefined;
                    }
                    if (renderer.rendererApi) {
                        return renderer.rendererApi;
                    }
                    return renderer.getOrLoad();
                },
                workspace: {
                    get isTrusted() { return true; } // TODO use Workspace trust service
                },
                settings: {
                    get lineLimit() { return ctx.renderOptions.lineLimit; },
                    get outputScrolling() { return ctx.renderOptions.outputScrolling; },
                    get outputWordWrap() { return ctx.renderOptions.outputWordWrap; },
                },
                get onDidChangeSettings() { return settingChange.event; },
            };
            if (this.data.requiresMessaging) {
                context.onDidReceiveMessage = this.onMessageEvent.event;
                context.postMessage = message => theia.postMessage({ type: 'customRendererMessage', rendererId: this.data.id, message });
            }
            return Object.freeze(context);
        }
    }
    const renderers = new class {
        constructor() {
            this.renderers = new Map();
            for (const renderer of ctx.rendererData) {
                this.addRenderer(renderer);
            }
        }
        getRenderer(id) {
            return this.renderers.get(id);
        }
        rendererEqual(a, b) {
            if (a.id !== b.id || a.entrypoint.uri !== b.entrypoint.uri || a.entrypoint.extends !== b.entrypoint.extends || a.requiresMessaging !== b.requiresMessaging) {
                return false;
            }
            if (a.mimeTypes.length !== b.mimeTypes.length) {
                return false;
            }
            for (let i = 0; i < a.mimeTypes.length; i++) {
                if (a.mimeTypes[i] !== b.mimeTypes[i]) {
                    return false;
                }
            }
            return true;
        }
        updateRendererData(rendererData) {
            const oldKeys = new Set(this.renderers.keys());
            const newKeys = new Set(rendererData.map(d => d.id));
            for (const renderer of rendererData) {
                const existing = this.renderers.get(renderer.id);
                if (existing && this.rendererEqual(existing.data, renderer)) {
                    continue;
                }
                this.addRenderer(renderer);
            }
            for (const key of oldKeys) {
                if (!newKeys.has(key)) {
                    this.renderers.delete(key);
                }
            }
        }
        addRenderer(renderer) {
            this.renderers.set(renderer.id, new Renderer(renderer));
        }
        clearAll() {
            for (const renderer of this.renderers.values()) {
                renderer.disposeOutputItem();
            }
        }
        clearOutput(rendererId, outputId) {
            var _a;
            // outputRunner.cancelOutput(outputId);
            (_a = this.renderers.get(rendererId)) === null || _a === void 0 ? void 0 : _a.disposeOutputItem(outputId);
        }
        async render(output, preferredMimeType, preferredRendererId, signal) {
            const item = output.findItemToRender(preferredMimeType);
            const primaryRenderer = this.findRenderer(preferredRendererId, item);
            if (!primaryRenderer) {
                this.showRenderError(item, output.element, 'No renderer found for output type.');
                return;
            }
            // Try primary renderer first
            if (!(await this.doRender(item, output.element, primaryRenderer, signal)).continue) {
                output.renderer = primaryRenderer;
                this.onRenderCompleted();
                return;
            }
            // Primary renderer failed in an expected way. Fallback to render the next mime types
            for (const additionalItem of output.allItems) {
                if (additionalItem.mime === item.mime) {
                    continue;
                }
                if (signal.aborted) {
                    return;
                }
                if (additionalItem) {
                    const renderer = this.findRenderer(undefined, additionalItem);
                    if (renderer) {
                        if (!(await this.doRender(additionalItem, output.element, renderer, signal)).continue) {
                            output.renderer = renderer;
                            this.onRenderCompleted();
                            return; // We rendered successfully
                        }
                    }
                }
            }
            // All renderers have failed and there is nothing left to fallback to
            this.showRenderError(item, output.element, 'No fallback renderers found or all fallback renderers failed.');
        }
        onRenderCompleted() {
            // we need to check for all images are loaded. Otherwise we can't determine the correct height of the output
            const images = Array.from(document.images);
            if (images.length > 0) {
                Promise.all(images.filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => theia.postMessage({ type: 'didRenderOutput', contentHeight: document.body.clientHeight }));
            }
            else {
                theia.postMessage({ type: 'didRenderOutput', contentHeight: document.body.clientHeight });
            }
        }
        async doRender(item, element, renderer, signal) {
            var _a;
            try {
                (_a = (await renderer.getOrLoad())) === null || _a === void 0 ? void 0 : _a.renderOutputItem(item, element, signal);
                return { continue: false }; // We rendered successfully
            }
            catch (e) {
                if (signal.aborted) {
                    return { continue: false };
                }
                if (e instanceof Error && e.name === renderFallbackErrorName) {
                    return { continue: true };
                }
                else {
                    throw e; // Bail and let callers handle unknown errors
                }
            }
        }
        findRenderer(preferredRendererId, info) {
            let foundRenderer;
            if (typeof preferredRendererId === 'string') {
                foundRenderer = Array.from(this.renderers.values())
                    .find(renderer => renderer.data.id === preferredRendererId);
            }
            else {
                const rendererList = Array.from(this.renderers.values())
                    .filter(renderer => renderer.data.mimeTypes.includes(info.mime) && !renderer.data.entrypoint.extends);
                if (rendererList.length) {
                    // De-prioritize built-in renderers
                    // rendererList.sort((a, b) => +a.data.isBuiltin - +b.data.isBuiltin);
                    // Use first renderer we find in sorted list
                    foundRenderer = rendererList[0];
                }
            }
            return foundRenderer;
        }
        showRenderError(info, element, errorMessage) {
            const errorContainer = document.createElement('div');
            const error = document.createElement('div');
            error.className = 'no-renderer-error';
            error.innerText = errorMessage;
            const cellText = document.createElement('div');
            cellText.innerText = info.text();
            errorContainer.appendChild(error);
            errorContainer.appendChild(cellText);
            element.innerText = '';
            element.appendChild(errorContainer);
        }
    }();
    function clearOutput(outputId) {
        var _a;
        (_a = outputs.get(outputId)) === null || _a === void 0 ? void 0 : _a.clear();
        outputs.delete(outputId);
    }
    function outputsChanged(changedEvent) {
        var _a, _b;
        for (const outputId of (_a = changedEvent.deletedOutputIds) !== null && _a !== void 0 ? _a : []) {
            clearOutput(outputId);
        }
        for (const outputData of (_b = changedEvent.newOutputs) !== null && _b !== void 0 ? _b : []) {
            const apiItems = outputData.items.map((item, index) => ({
                id: `${outputData.id}-${index}`,
                mime: item.mime,
                metadata: outputData.metadata,
                data() {
                    return item.data;
                },
                text() {
                    return new TextDecoder().decode(this.data());
                },
                json() {
                    return JSON.parse(this.text());
                },
                blob() {
                    return new Blob([this.data()], { type: this.mime });
                },
            }));
            const output = new Output(outputData, apiItems);
            outputs.set(outputData.id, output);
            renderers.render(output, undefined, undefined, new AbortController().signal);
        }
    }
    function scrollParent(event) {
        for (let node = event.target; node; node = node.parentNode) {
            if (!(node instanceof Element)) {
                continue;
            }
            // scroll up
            if (event.deltaY < 0 && node.scrollTop > 0) {
                // there is still some content to scroll
                return false;
            }
            // scroll down
            if (event.deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight) {
                // per https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
                // scrollTop is not rounded but scrollHeight and clientHeight are
                // so we need to check if the difference is less than some threshold
                if (node.scrollHeight - node.scrollTop - node.clientHeight > 2) {
                    return false;
                }
            }
        }
        return true;
    }
    const handleWheel = (event) => {
        if (scrollParent(event)) {
            theia.postMessage({
                type: 'did-scroll-wheel',
                deltaY: event.deltaY,
                deltaX: event.deltaX,
            });
        }
    };
    window.addEventListener('message', async (rawEvent) => {
        var _a;
        const event = rawEvent;
        switch (event.data.type) {
            case 'updateRenderers':
                renderers.updateRendererData(event.data.rendererData);
                break;
            case 'outputChanged':
                outputsChanged(event.data);
                break;
            case 'customRendererMessage':
                (_a = renderers.getRenderer(event.data.rendererId)) === null || _a === void 0 ? void 0 : _a.receiveMessage(event.data.message);
                break;
            case 'changePreferredMimetype':
                clearOutput(event.data.outputId);
                renderers.render(outputs.get(event.data.outputId), event.data.mimeType, undefined, new AbortController().signal);
                break;
        }
    });
    window.addEventListener('wheel', handleWheel);
    theia.postMessage({ type: 'initialized' });
}
exports.outputWebviewPreload = outputWebviewPreload;
//# sourceMappingURL=output-webview-internal.js.map