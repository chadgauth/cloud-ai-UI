/********************************************************************************
 * Copyright (C) 2022 TypeFox and others.
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
import { RequestConfiguration, RequestContext, RequestOptions, RequestService } from '@theia/request';
export declare class BackendRequestFacade implements RequestService {
    protected readonly requestService: RequestService;
    configure(config: RequestConfiguration): Promise<void>;
    request(options: RequestOptions): Promise<RequestContext>;
    resolveProxy(url: string): Promise<string | undefined>;
}
//# sourceMappingURL=backend-request-facade.d.ts.map