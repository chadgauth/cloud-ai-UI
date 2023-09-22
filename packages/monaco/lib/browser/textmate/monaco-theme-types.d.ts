import * as monaco from '@theia/monaco-editor-core';
import { IStandaloneTheme } from '@theia/monaco-editor-core/esm/vs/editor/standalone/common/standaloneTheme';
import { IOnigLib, Registry } from 'vscode-textmate';
import { IRawTheme } from 'vscode-textmate/release/theme';
export interface ThemeMix extends IRawTheme, monaco.editor.IStandaloneThemeData {
}
export interface MixStandaloneTheme extends IStandaloneTheme {
    themeData: ThemeMix;
}
export declare const OnigasmProvider: unique symbol;
export declare type OnigasmProvider = () => Promise<IOnigLib>;
export declare const TextmateRegistryFactory: unique symbol;
export declare type TextmateRegistryFactory = (currentTheme?: ThemeMix) => Registry;
export declare type MonacoThemeColor = monaco.editor.IColors;
export interface MonacoTokenRule extends monaco.editor.ITokenThemeRule {
}
export declare type MonacoBuiltinTheme = monaco.editor.BuiltinTheme;
export interface MonacoTheme extends monaco.editor.IStandaloneThemeData {
    name: string;
}
//# sourceMappingURL=monaco-theme-types.d.ts.map