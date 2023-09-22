import { DefaultUriLabelProviderContribution, DidChangeLabelEvent } from '@theia/core/lib/browser/label-provider';
import URI from '@theia/core/lib/common/uri';
import { Emitter, Event } from '@theia/core';
export declare class SampleDynamicLabelProviderContribution extends DefaultUriLabelProviderContribution {
    protected isActive: boolean;
    constructor();
    canHandle(element: object): number;
    toggle(): void;
    private fireLabelsDidChange;
    protected getUri(element: URI): URI;
    getIcon(element: URI): string;
    protected readonly onDidChangeEmitter: Emitter<DidChangeLabelEvent>;
    private x;
    getName(element: URI): string | undefined;
    getLongName(element: URI): string | undefined;
    get onDidChange(): Event<DidChangeLabelEvent>;
}
//# sourceMappingURL=sample-dynamic-label-provider-contribution.d.ts.map