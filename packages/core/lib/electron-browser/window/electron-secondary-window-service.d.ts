import { DefaultSecondaryWindowService } from '../../browser/window/default-secondary-window-service';
import { ApplicationShell, ExtractableWidget } from 'src/browser';
export declare class ElectronSecondaryWindowService extends DefaultSecondaryWindowService {
    focus(win: Window): void;
    protected doCreateSecondaryWindow(widget: ExtractableWidget, shell: ApplicationShell): Window | undefined;
    private canClose;
}
//# sourceMappingURL=electron-secondary-window-service.d.ts.map