/// <reference types="node" />
export interface Codec {
    id: number;
    name: string;
    longName: string;
}
export interface FfmpegNativeAddon {
    codecs(ffmpegPath: string): Codec[];
}
export interface FfmpegNameAndLocation {
    /**
     * Name with extension of the shared library.
     */
    name: string;
    /**
     * Relative location of the file from Electron's dist root.
     */
    location: string;
}
export interface FfmpegOptions {
    electronVersion?: string;
    electronDist?: string;
    ffmpegPath?: string;
    platform?: NodeJS.Platform;
}
/**
 * @internal
 */
export declare function _loadFfmpegNativeAddon(): FfmpegNativeAddon;
/**
 * @returns name and relative path from Electron's root where FFMPEG is located at.
 */
export declare function ffmpegNameAndLocation({ platform }?: FfmpegOptions): FfmpegNameAndLocation;
/**
 * @returns relative ffmpeg shared library path from the Electron distribution root.
 */
export declare function ffmpegRelativePath(options?: FfmpegOptions): string;
/**
 * @returns absolute ffmpeg shared library path.
 */
export declare function ffmpegAbsolutePath(options?: FfmpegOptions): string;
/**
 * Dynamically link to `ffmpegPath` and use FFMPEG APIs to list the included `Codec`s.
 * @param ffmpegPath absolute path the the FFMPEG shared library.
 * @returns list of codecs for the given ffmpeg shared library.
 */
export declare function getFfmpegCodecs(ffmpegPath: string): Codec[];
//# sourceMappingURL=ffmpeg.d.ts.map