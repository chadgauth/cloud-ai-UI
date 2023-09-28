/// <reference types="react" />
import * as React from '@theia/core/shared/react';
import URI from '@theia/core/lib/common/uri';
import { TreeElement } from '@theia/core/lib/browser/source-tree';
import { OpenerService, OpenerOptions } from '@theia/core/lib/browser/opener-service';
import { HostedPluginSupport } from '@theia/plugin-ext/lib/hosted/browser/hosted-plugin';
import { PluginServer, DeployedPlugin, PluginDeployOptions } from '@theia/plugin-ext/lib/common/plugin-protocol';
import { ProgressService } from '@theia/core/lib/common/progress-service';
import { VSXEnvironment } from '../common/vsx-environment';
import { VSXExtensionsSearchModel } from './vsx-extensions-search-model';
import { CommandRegistry, MenuPath } from '@theia/core/lib/common';
import { ContextMenuRenderer, HoverService, TreeWidget } from '@theia/core/lib/browser';
import { VSXExtensionNamespaceAccess, VSXUser } from '@theia/ovsx-client/lib/ovsx-types';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
export declare const EXTENSIONS_CONTEXT_MENU: MenuPath;
export declare namespace VSXExtensionsContextMenu {
    const INSTALL: string[];
    const COPY: string[];
}
export declare class VSXExtensionData {
    readonly version?: string;
    readonly iconUrl?: string;
    readonly publisher?: string;
    readonly name?: string;
    readonly displayName?: string;
    readonly description?: string;
    readonly averageRating?: number;
    readonly downloadCount?: number;
    readonly downloadUrl?: string;
    readonly readmeUrl?: string;
    readonly licenseUrl?: string;
    readonly repository?: string;
    readonly license?: string;
    readonly readme?: string;
    readonly preview?: boolean;
    readonly namespaceAccess?: VSXExtensionNamespaceAccess;
    readonly publishedBy?: VSXUser;
    static KEYS: Set<(keyof VSXExtensionData)>;
}
export declare class VSXExtensionOptions {
    readonly id: string;
}
export declare const VSXExtensionFactory: unique symbol;
export declare type VSXExtensionFactory = (options: VSXExtensionOptions) => VSXExtension;
export declare class VSXExtension implements VSXExtensionData, TreeElement {
    /**
     * Ensure the version string begins with `'v'`.
     */
    static formatVersion(version: string | undefined): string | undefined;
    protected readonly options: VSXExtensionOptions;
    protected readonly openerService: OpenerService;
    protected readonly pluginSupport: HostedPluginSupport;
    protected readonly pluginServer: PluginServer;
    protected readonly progressService: ProgressService;
    protected readonly contextMenuRenderer: ContextMenuRenderer;
    readonly environment: VSXEnvironment;
    readonly search: VSXExtensionsSearchModel;
    protected readonly hoverService: HoverService;
    readonly windowService: WindowService;
    readonly commandRegistry: CommandRegistry;
    protected readonly data: Partial<VSXExtensionData>;
    protected registryUri: Promise<string>;
    protected postConstruct(): void;
    get uri(): URI;
    get id(): string;
    get visible(): boolean;
    get plugin(): DeployedPlugin | undefined;
    get installed(): boolean;
    get builtin(): boolean;
    update(data: Partial<VSXExtensionData>): void;
    reloadWindow(): void;
    protected getData<K extends keyof VSXExtensionData>(key: K): VSXExtensionData[K];
    get iconUrl(): string | undefined;
    get publisher(): string | undefined;
    get name(): string | undefined;
    get displayName(): string | undefined;
    get description(): string | undefined;
    get version(): string | undefined;
    get averageRating(): number | undefined;
    get downloadCount(): number | undefined;
    get downloadUrl(): string | undefined;
    get readmeUrl(): string | undefined;
    get licenseUrl(): string | undefined;
    get repository(): string | undefined;
    get license(): string | undefined;
    get readme(): string | undefined;
    get preview(): boolean | undefined;
    get namespaceAccess(): VSXExtensionNamespaceAccess | undefined;
    get publishedBy(): VSXUser | undefined;
    get tooltip(): string;
    protected _busy: number;
    get busy(): boolean;
    install(options?: PluginDeployOptions): Promise<void>;
    uninstall(): Promise<void>;
    handleContextMenu(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    /**
     * Get the registry link for the given extension.
     * @param path the url path.
     * @returns the registry link for the given extension at the path.
     */
    getRegistryLink(path?: string): Promise<URI>;
    serialize(): Promise<string>;
    open(options?: OpenerOptions): Promise<void>;
    doOpen(uri: URI, options?: OpenerOptions): Promise<void>;
    render(host: TreeWidget): React.ReactNode;
}
export declare abstract class AbstractVSXExtensionComponent<Props extends AbstractVSXExtensionComponent.Props = AbstractVSXExtensionComponent.Props> extends React.Component<Props> {
    readonly install: (event?: React.MouseEvent<Element, MouseEvent> | undefined) => Promise<void>;
    readonly uninstall: (event?: React.MouseEvent<Element, MouseEvent> | undefined) => Promise<void>;
    readonly reloadWindow: (event?: React.MouseEvent<Element, MouseEvent> | undefined) => void;
    protected readonly manage: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    protected renderAction(host?: TreeWidget): React.ReactNode;
}
export declare namespace AbstractVSXExtensionComponent {
    interface Props {
        extension: VSXExtension;
    }
}
export declare namespace VSXExtensionComponent {
    interface Props extends AbstractVSXExtensionComponent.Props {
        host: TreeWidget;
        hoverService: HoverService;
    }
}
export declare class VSXExtensionComponent<Props extends VSXExtensionComponent.Props = VSXExtensionComponent.Props> extends AbstractVSXExtensionComponent<Props> {
    render(): React.ReactNode;
}
export declare class VSXExtensionEditorComponent extends AbstractVSXExtensionComponent {
    protected header: HTMLElement | undefined;
    protected body: HTMLElement | undefined;
    protected _scrollContainer: HTMLElement | undefined;
    get scrollContainer(): HTMLElement | undefined;
    render(): React.ReactNode;
    protected renderNamespaceAccess(): React.ReactNode;
    protected renderStars(): React.ReactNode;
    readonly openLink: (event: React.MouseEvent) => void;
    readonly openExtension: (e: React.MouseEvent) => Promise<void>;
    readonly searchPublisher: (e: React.MouseEvent) => void;
    readonly openPublishedBy: (e: React.MouseEvent) => Promise<void>;
    readonly openAverageRating: (e: React.MouseEvent) => Promise<void>;
    readonly openRepository: (e: React.MouseEvent) => void;
    readonly openLicense: (e: React.MouseEvent) => void;
}
//# sourceMappingURL=vsx-extension.d.ts.map