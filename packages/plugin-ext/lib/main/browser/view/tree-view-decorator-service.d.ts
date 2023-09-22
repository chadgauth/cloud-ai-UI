/********************************************************************************
 * Copyright (C) 2021 1C-Soft LLC and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
 ********************************************************************************/
import { interfaces } from '@theia/core/shared/inversify';
import { AbstractTreeDecoratorService, TreeDecorator } from '@theia/core/lib/browser/tree/tree-decorator';
import { ContributionProvider } from '@theia/core';
import { TreeNode } from '@theia/core/lib/browser';
import { TreeItem } from '@theia/plugin';
import { FileTreeDecoratorAdapter } from '@theia/filesystem/lib/browser';
export declare const TreeViewDecorator: unique symbol;
export declare class TreeViewDecoratorAdapter extends FileTreeDecoratorAdapter {
    protected getUriForNode(node: TreeNode | TreeItem): string | undefined;
    protected isTreeItem(node: unknown): node is TreeItem;
}
export declare class TreeViewDecoratorService extends AbstractTreeDecoratorService {
    constructor(contributions: ContributionProvider<TreeDecorator>);
}
export declare function bindTreeViewDecoratorUtilities(bind: interfaces.Bind): void;
//# sourceMappingURL=tree-view-decorator-service.d.ts.map