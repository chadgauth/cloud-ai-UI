"use strict";
// *****************************************************************************
// Copyright (C) 2019 Ericsson and others.
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
exports.getFfmpegCodecs = exports.ffmpegAbsolutePath = exports.ffmpegRelativePath = exports.ffmpegNameAndLocation = exports._loadFfmpegNativeAddon = void 0;
const path = require("path");
/**
 * @internal
 */
function _loadFfmpegNativeAddon() {
    try {
        return require('../build/Release/ffmpeg.node');
    }
    catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return require('../build/Debug/ffmpeg.node');
        }
        else {
            throw error;
        }
    }
}
exports._loadFfmpegNativeAddon = _loadFfmpegNativeAddon;
/**
 * @returns name and relative path from Electron's root where FFMPEG is located at.
 */
function ffmpegNameAndLocation({ platform = process.platform } = {}) {
    switch (platform) {
        case 'darwin':
            return {
                name: 'libffmpeg.dylib',
                location: 'Electron.app/Contents/Frameworks/Electron Framework.framework/Libraries/',
            };
        case 'win32':
            return {
                name: 'ffmpeg.dll',
                location: '',
            };
        case 'linux':
            return {
                name: 'libffmpeg.so',
                location: '',
            };
        default:
            throw new Error(`${platform} is not supported`);
    }
}
exports.ffmpegNameAndLocation = ffmpegNameAndLocation;
/**
 * @returns relative ffmpeg shared library path from the Electron distribution root.
 */
function ffmpegRelativePath(options = {}) {
    const { location, name } = ffmpegNameAndLocation(options);
    return path.join(location, name);
}
exports.ffmpegRelativePath = ffmpegRelativePath;
/**
 * @returns absolute ffmpeg shared library path.
 */
function ffmpegAbsolutePath(options = {}) {
    const { electronDist = path.resolve(require.resolve('electron/package.json'), '..', 'dist') } = options;
    return path.join(electronDist, ffmpegRelativePath(options));
}
exports.ffmpegAbsolutePath = ffmpegAbsolutePath;
/**
 * Dynamically link to `ffmpegPath` and use FFMPEG APIs to list the included `Codec`s.
 * @param ffmpegPath absolute path the the FFMPEG shared library.
 * @returns list of codecs for the given ffmpeg shared library.
 */
function getFfmpegCodecs(ffmpegPath) {
    return _loadFfmpegNativeAddon().codecs(ffmpegPath);
}
exports.getFfmpegCodecs = getFfmpegCodecs;
//# sourceMappingURL=ffmpeg.js.map