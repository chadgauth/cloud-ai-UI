import * as puppeteer from 'puppeteer-core';
export interface TestFileOptions {
    ignore: string[];
    extension: string[];
    file: string[];
    recursive: boolean;
    sort: boolean;
    spec: string[];
}
export interface TestPageOptions {
    files?: Partial<TestFileOptions>;
    newPage: () => Promise<puppeteer.Page>;
    matchAppUrl?: (url: string) => boolean;
    onWillRun?: () => Promise<void>;
    onDidRun?: (failures: number) => Promise<void>;
}
export default function newTestPage(options: TestPageOptions): Promise<puppeteer.Page>;
//# sourceMappingURL=test-page.d.ts.map