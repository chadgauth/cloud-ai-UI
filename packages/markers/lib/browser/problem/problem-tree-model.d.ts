/// <reference types="lodash" />
import { ProblemManager } from './problem-manager';
import { MarkerNode, MarkerTree, MarkerOptions, MarkerInfoNode } from '../marker-tree';
import { MarkerTreeModel } from '../marker-tree-model';
import { OpenerOptions, TreeNode } from '@theia/core/lib/browser';
import { Marker } from '../../common/marker';
import { Diagnostic } from '@theia/core/shared/vscode-languageserver-protocol';
export declare class ProblemTree extends MarkerTree<Diagnostic> {
    protected markers: {
        node: MarkerInfoNode;
        markers: Marker<Diagnostic>[];
    }[];
    constructor(markerManager: ProblemManager, markerOptions: MarkerOptions);
    protected getMarkerNodes(parent: MarkerInfoNode, markers: Marker<Diagnostic>[]): MarkerNode[];
    /**
     * Sort markers based on the following rules:
     * - Markers are fist sorted by `severity`.
     * - Markers are sorted by `line number` if applicable.
     * - Markers are sorted by `column number` if applicable.
     * - Markers are then finally sorted by `owner` if applicable.
     * @param a the first marker for comparison.
     * @param b the second marker for comparison.
     */
    protected sortMarkers(a: MarkerNode, b: MarkerNode): number;
    protected insertNodeWithMarkers(node: MarkerInfoNode, markers: Marker<Diagnostic>[]): void;
    protected doInsertNodesWithMarkers: import("lodash").DebouncedFunc<() => void>;
}
export declare class ProblemTreeModel extends MarkerTreeModel {
    protected readonly problemManager: ProblemManager;
    protected getOpenerOptionsByMarker(node: MarkerNode): OpenerOptions | undefined;
    removeNode(node: TreeNode): void;
}
//# sourceMappingURL=problem-tree-model.d.ts.map