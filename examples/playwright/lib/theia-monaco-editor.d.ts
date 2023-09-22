import { ElementHandle } from '@playwright/test';
import { TheiaPageObject } from './theia-page-object';
import { TheiaApp } from './theia-app';
export declare class TheiaMonacoEditor extends TheiaPageObject {
    protected readonly selector: string;
    constructor(selector: string, app: TheiaApp);
    waitForVisible(): Promise<void>;
    protected viewElement(): Promise<ElementHandle<SVGElement | HTMLElement> | null>;
    numberOfLines(): Promise<number | undefined>;
    textContentOfLineByLineNumber(lineNumber: number): Promise<string | undefined>;
    lineByLineNumber(lineNumber: number): Promise<ElementHandle<SVGElement | HTMLElement> | undefined>;
    textContentOfLineContainingText(text: string): Promise<string | undefined>;
    lineContainingText(text: string): Promise<ElementHandle<SVGElement | HTMLElement> | undefined>;
    protected replaceEditorSymbolsWithSpace(content: string): string | Promise<string | undefined>;
}
//# sourceMappingURL=theia-monaco-editor.d.ts.map