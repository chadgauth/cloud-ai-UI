import { WebviewPanelOptions, WebviewPortMapping } from '@theia/plugin';
import { BaseWidget, Message } from '@theia/core/lib/browser/widgets/widget';
import { Disposable, DisposableCollection } from '@theia/core/lib/common/disposable';
import { ApplicationShellMouseTracker } from '@theia/core/lib/browser/shell/application-shell-mouse-tracker';
import { StatefulWidget } from '@theia/core/lib/browser/shell/shell-layout-restorer';
import { WebviewPanelViewState } from '../../../common/plugin-api-rpc';
import { IconUrl } from '../../../common/plugin-protocol';
import { Deferred } from '@theia/core/lib/common/promise-util';
import { WebviewEnvironment } from './webview-environment';
import URI from '@theia/core/lib/common/uri';
import { Emitter, Event } from '@theia/core/lib/common/event';
import { OpenerService } from '@theia/core/lib/browser/opener-service';
import { KeybindingRegistry } from '@theia/core/lib/browser/keybinding';
import { PluginSharedStyle } from '../plugin-shared-style';
import { WebviewThemeDataProvider } from './webview-theme-data-provider';
import { ExternalUriService } from '@theia/core/lib/browser/external-uri-service';
import { OutputChannelManager } from '@theia/output/lib/browser/output-channel';
import { WebviewPreferences } from './webview-preferences';
import { WebviewResourceCache } from './webview-resource-cache';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { ViewColumn } from '../../../plugin/types-impl';
import { ExtractableWidget } from '@theia/core/lib/browser/widgets/extractable-widget';
import { BadgeWidget } from '@theia/core/lib/browser/view-container';
export declare const enum WebviewMessageChannels {
    onmessage = "onmessage",
    didClickLink = "did-click-link",
    didFocus = "did-focus",
    didBlur = "did-blur",
    doUpdateState = "do-update-state",
    doReload = "do-reload",
    loadResource = "load-resource",
    loadLocalhost = "load-localhost",
    webviewReady = "webview-ready",
    didKeydown = "did-keydown",
    didMouseDown = "did-mousedown",
    didMouseUp = "did-mouseup"
}
export interface WebviewContentOptions {
    readonly allowScripts?: boolean;
    readonly allowForms?: boolean;
    readonly localResourceRoots?: ReadonlyArray<string>;
    readonly portMapping?: ReadonlyArray<WebviewPortMapping>;
    readonly enableCommandUris?: boolean | readonly string[];
}
export declare class WebviewWidgetIdentifier {
    id: string;
}
export declare const WebviewWidgetExternalEndpoint: unique symbol;
export declare class WebviewWidget extends BaseWidget implements StatefulWidget, ExtractableWidget, BadgeWidget {
    private static readonly standardSupportedLinkSchemes;
    static FACTORY_ID: string;
    protected element: HTMLIFrameElement | undefined;
    protected transparentOverlay: HTMLElement;
    readonly identifier: WebviewWidgetIdentifier;
    readonly externalEndpoint: string;
    protected readonly mouseTracker: ApplicationShellMouseTracker;
    protected readonly environment: WebviewEnvironment;
    protected readonly openerService: OpenerService;
    protected readonly keybindings: KeybindingRegistry;
    protected readonly sharedStyle: PluginSharedStyle;
    protected readonly themeDataProvider: WebviewThemeDataProvider;
    protected readonly externalUriService: ExternalUriService;
    protected readonly outputManager: OutputChannelManager;
    protected readonly preferences: WebviewPreferences;
    protected readonly fileService: FileService;
    protected readonly resourceCache: WebviewResourceCache;
    viewState: WebviewPanelViewState;
    protected html: string;
    protected _contentOptions: WebviewContentOptions;
    get contentOptions(): WebviewContentOptions;
    protected _state: string | undefined;
    get state(): string | undefined;
    viewType: string;
    viewColumn: ViewColumn;
    options: WebviewPanelOptions;
    protected ready: Deferred<void>;
    protected readonly onMessageEmitter: Emitter<any>;
    readonly onMessage: Event<any>;
    protected readonly pendingMessages: any[];
    protected readonly toHide: DisposableCollection;
    protected hideTimeout: any | number | undefined;
    isExtractable: boolean;
    secondaryWindow: Window | undefined;
    protected _badge?: number | undefined;
    protected _badgeTooltip?: string | undefined;
    protected onDidChangeBadgeEmitter: Emitter<void>;
    protected onDidChangeBadgeTooltipEmitter: Emitter<void>;
    protected init(): void;
    get onDidChangeBadge(): Event<void>;
    get onDidChangeBadgeTooltip(): Event<void>;
    get badge(): number | undefined;
    set badge(badge: number | undefined);
    get badgeTooltip(): string | undefined;
    set badgeTooltip(badgeTooltip: string | undefined);
    protected onBeforeAttach(msg: Message): void;
    protected onAfterAttach(msg: Message): void;
    protected onBeforeShow(msg: Message): void;
    protected onAfterHide(msg: Message): void;
    protected doHide(): void;
    protected forceHide(): void;
    protected doShow(): void;
    protected loadLocalhost(origin: string): Promise<void>;
    protected dispatchMouseEvent(type: string, data: MouseEvent): void;
    protected getRedirect(url: string): Promise<string | undefined>;
    protected toRemoteUrl(localUri: URI): Promise<string>;
    setContentOptions(contentOptions: WebviewContentOptions): void;
    protected iconUrl: IconUrl | undefined;
    protected readonly toDisposeOnIcon: DisposableCollection;
    setIconUrl(iconUrl: IconUrl | undefined): void;
    protected toEndpoint(pathname: string): string;
    setHTML(value: string): void;
    protected preprocessHtml(value: string): string;
    protected onActivateRequest(msg: Message): void;
    reload(): void;
    protected style(): void;
    protected openLink(link: URI): void;
    protected toSupportedLink(link: URI): URI | undefined;
    protected loadResource(requestPath: string): Promise<void>;
    protected normalizeRequestUri(requestPath: string): URI;
    sendMessage(data: any): void;
    protected doUpdateContent(): void;
    storeState(): WebviewWidget.State;
    restoreState(oldState: WebviewWidget.State): void;
    setIframeHeight(height: number): void;
    protected doSend(channel: string, data?: any): Promise<void>;
    protected postMessage(channel: string, data?: any): void;
    protected on<T = unknown>(channel: WebviewMessageChannels, handler: (data: T) => void): Disposable;
    protected trace(kind: 'in' | 'out', channel: string, data?: any): void;
}
export declare namespace WebviewWidget {
    namespace Styles {
        const WEBVIEW = "theia-webview";
    }
    interface State {
        viewType: string;
        title: string;
        iconUrl?: IconUrl;
        options: WebviewPanelOptions;
        contentOptions: WebviewContentOptions;
        state?: string;
    }
}
//# sourceMappingURL=webview.d.ts.map