import { MenuPath } from '@theia/core';
import { URI as CodeUri } from '@theia/core/shared/vscode-uri';
import { EditorWidget } from '@theia/editor/lib/browser';
import { WebviewWidget } from '../webview/webview';
export declare const PLUGIN_EDITOR_TITLE_MENU: string[];
export declare const PLUGIN_EDITOR_TITLE_RUN_MENU: string[];
export declare const PLUGIN_SCM_TITLE_MENU: string[];
export declare const PLUGIN_VIEW_TITLE_MENU: string[];
export declare const implementedVSCodeContributionPoints: readonly ["comments/comment/context", "comments/comment/title", "comments/commentThread/context", "debug/callstack/context", "debug/variables/context", "debug/toolBar", "editor/context", "editor/title", "editor/title/context", "editor/title/run", "editor/lineNumber/context", "explorer/context", "scm/resourceFolder/context", "scm/resourceGroup/context", "scm/resourceState/context", "scm/title", "timeline/item/context", "view/item/context", "view/title"];
export declare type ContributionPoint = (typeof implementedVSCodeContributionPoints)[number];
/** The values are menu paths to which the VSCode contribution points correspond */
export declare const codeToTheiaMappings: Map<"comments/comment/context" | "comments/comment/title" | "comments/commentThread/context" | "debug/callstack/context" | "debug/variables/context" | "debug/toolBar" | "editor/context" | "editor/title" | "editor/title/context" | "editor/title/run" | "editor/lineNumber/context" | "explorer/context" | "scm/resourceFolder/context" | "scm/resourceGroup/context" | "scm/resourceState/context" | "scm/title" | "timeline/item/context" | "view/item/context" | "view/title", MenuPath[]>;
declare type CodeEditorWidget = EditorWidget | WebviewWidget;
export declare class CodeEditorWidgetUtil {
    is(arg: unknown): arg is CodeEditorWidget;
    getResourceUri(editor: CodeEditorWidget): CodeUri | undefined;
}
export {};
//# sourceMappingURL=vscode-theia-menu-mappings.d.ts.map