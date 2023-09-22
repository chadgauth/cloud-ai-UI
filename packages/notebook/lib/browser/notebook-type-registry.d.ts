import { Disposable } from '@theia/core';
import { NotebookTypeDescriptor } from '../common/notebook-protocol';
export declare class NotebookTypeRegistry {
    readonly notebookTypes: NotebookTypeDescriptor[];
    registerNotebookType(type: NotebookTypeDescriptor): Disposable;
}
//# sourceMappingURL=notebook-type-registry.d.ts.map