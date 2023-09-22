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
exports.readElectronVersion = exports.replaceFfmpeg = void 0;
const electronGet = require("@electron/get");
const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const unzipper = require("unzipper");
const ffmpeg = require("./ffmpeg");
const hash_1 = require("./hash");
async function replaceFfmpeg(options = {}) {
    let shouldDownload = true;
    let shouldReplace = true;
    const { name: ffmpegName, location: ffmpegLocation, } = ffmpeg.ffmpegNameAndLocation(options);
    const { electronDist = path.resolve(require.resolve('electron/package.json'), '..', 'dist'), electronVersion = await readElectronVersion(electronDist), ffmpegPath = path.resolve(electronDist, ffmpegLocation, ffmpegName), } = options;
    const ffmpegCachedPath = path.join(os.tmpdir(), `theia-cli/cache/electron-v${electronVersion}`, ffmpegName);
    if (await fs.pathExists(ffmpegCachedPath)) {
        shouldDownload = false; // If the file is already cached, do not download.
        console.warn('Found cached ffmpeg library.');
        const [cacheHash, distHash] = await Promise.all([
            (0, hash_1.hashFile)(ffmpegCachedPath),
            (0, hash_1.hashFile)(ffmpegPath),
        ]);
        if (cacheHash.equals(distHash)) {
            shouldReplace = false; // If files are already the same, do not replace.
            console.warn('Hashes are equal, not replacing the ffmpeg library.');
        }
    }
    if (shouldDownload) {
        const ffmpegZipPath = await electronGet.downloadArtifact({
            version: electronVersion,
            artifactName: 'ffmpeg'
        });
        const ffmpegZip = await unzipper.Open.file(ffmpegZipPath);
        const file = ffmpegZip.files.find(f => f.path.endsWith(ffmpegName));
        if (!file) {
            throw new Error(`Archive did not contain "${ffmpegName}".`);
        }
        // Extract file to cache.
        await fs.mkdirp(path.dirname(ffmpegCachedPath));
        await new Promise((resolve, reject) => {
            file.stream()
                .pipe(fs.createWriteStream(ffmpegCachedPath))
                .on('finish', resolve)
                .on('error', reject);
        });
        console.warn(`Downloaded ffmpeg shared library { version: "${electronVersion}", dist: "${electronDist}" }.`);
    }
    if (shouldReplace) {
        await fs.copy(ffmpegCachedPath, ffmpegPath);
        console.warn(`Successfully replaced "${ffmpegPath}".`);
    }
}
exports.replaceFfmpeg = replaceFfmpeg;
async function readElectronVersion(electronDist) {
    const electronVersionFilePath = path.resolve(electronDist, 'version');
    const version = await fs.readFile(electronVersionFilePath, 'utf8');
    return version.trim();
}
exports.readElectronVersion = readElectronVersion;
//# sourceMappingURL=replace-ffmpeg.js.map