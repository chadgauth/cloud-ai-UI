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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryArchiver = void 0;
const inversify_1 = require("@theia/core/shared/inversify");
const fs = require("@theia/core/shared/fs-extra");
const tar_fs_1 = require("tar-fs");
const uri_1 = require("@theia/core/lib/common/uri");
const file_uri_1 = require("@theia/core/lib/node/file-uri");
let DirectoryArchiver = class DirectoryArchiver {
    async archive(inputPath, outputPath, entries) {
        return new Promise(async (resolve, reject) => {
            (0, tar_fs_1.pack)(inputPath, { entries }).pipe(fs.createWriteStream(outputPath)).on('finish', () => resolve()).on('error', e => reject(e));
        });
    }
    async findCommonParents(uris) {
        const map = new Map();
        for (const uri of uris) {
            // 1. Get the container if not the URI is not a directory.
            const containerUri = (await this.isDir(uri)) ? uri : uri.parent;
            let containerUriStr = this.toUriString(containerUri);
            // 2. If the container already registered, just append the current URI to it.
            if (map.has(containerUriStr)) {
                map.set(containerUriStr, [...map.get(containerUriStr), this.toUriString(uri)]);
            }
            else {
                // 3. Try to find the longest container URI that we can use.
                // When we have `/A/B/` and `/A/C` and a file `A/B/C/D.txt` then we need to find `/A/B`. The longest URIs come first.
                for (const knownContainerUri of Array.from(map.keys()).sort((left, right) => right.length - left.length)) {
                    if (uri.toString().startsWith(knownContainerUri)) {
                        containerUriStr = knownContainerUri;
                        break;
                    }
                }
                const entries = map.get(containerUriStr) || [];
                entries.push(this.toUriString(uri));
                map.set(containerUriStr, entries);
            }
            // 4. Collapse the hierarchy by finding the closest common parents for the entries, if any.
            let collapsed = false;
            collapseLoop: while (!collapsed) {
                const knownContainerUris = Array.from(map.keys()).sort((left, right) => right.length - left.length);
                if (knownContainerUris.length > 1) {
                    for (let i = 0; i < knownContainerUris.length; i++) {
                        for (let j = i + 1; j < knownContainerUris.length; j++) {
                            const left = knownContainerUris[i];
                            const right = knownContainerUris[j];
                            const commonParent = this.closestCommonParentUri(new uri_1.default(left), new uri_1.default(right));
                            if (commonParent && !commonParent.path.isRoot) {
                                const leftEntries = map.get(left) || [];
                                const rightEntries = map.get(right) || [];
                                map.delete(left);
                                map.delete(right);
                                map.set(this.toUriString(commonParent), [...leftEntries, ...rightEntries]);
                                break collapseLoop;
                            }
                        }
                    }
                }
                collapsed = true;
            }
        }
        return map;
    }
    closestCommonParentUri(left, right) {
        if (left.scheme !== right.scheme) {
            return undefined;
        }
        const allLeft = left.allLocations;
        const allRight = right.allLocations;
        for (const leftUri of allLeft) {
            for (const rightUri of allRight) {
                if (this.equal(leftUri, rightUri)) {
                    return leftUri;
                }
            }
        }
        return undefined;
    }
    async isDir(uri) {
        try {
            const stat = await fs.stat(file_uri_1.FileUri.fsPath(uri));
            return stat.isDirectory();
        }
        catch {
            return false;
        }
    }
    equal(left, right) {
        if (Array.isArray(left) && Array.isArray(right)) {
            if (left === right) {
                return true;
            }
            if (left.length !== right.length) {
                return false;
            }
            return left.map(this.toUriString).sort().toString() === right.map(this.toUriString).sort().toString();
        }
        else if (left instanceof uri_1.default && right instanceof uri_1.default) {
            return this.toUriString(left) === this.toUriString(right);
        }
        return false;
    }
    toUriString(uri) {
        const raw = uri.toString();
        return raw.endsWith('/') ? raw.slice(0, -1) : raw;
    }
};
DirectoryArchiver = __decorate([
    (0, inversify_1.injectable)()
], DirectoryArchiver);
exports.DirectoryArchiver = DirectoryArchiver;
//# sourceMappingURL=directory-archiver.js.map