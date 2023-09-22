import { SecondaryWindowService } from './secondary-window-service';
import { WindowService } from './window-service';
import { ExtractableWidget } from '../widgets';
import { ApplicationShell } from '../shell';
export declare class DefaultSecondaryWindowService implements SecondaryWindowService {
    protected static SECONDARY_WINDOW_URL: string;
    /**
     * Randomized prefix to be included in opened windows' ids.
     * This avoids conflicts when creating sub-windows from multiple theia instances (e.g. by opening Theia multiple times in the same browser)
     */
    protected readonly prefix: number;
    /** Unique id. Increase after every access. */
    private nextId;
    protected secondaryWindows: Window[];
    protected readonly windowService: WindowService;
    init(): void;
    createSecondaryWindow(widget: ExtractableWidget, shell: ApplicationShell): Window | undefined;
    protected findWindow<T>(windowName: string): Window | undefined;
    protected doCreateSecondaryWindow(widget: ExtractableWidget, shell: ApplicationShell): Window | undefined;
    focus(win: Window): void;
    protected nextWindowId(): string;
}
//# sourceMappingURL=default-secondary-window-service.d.ts.map