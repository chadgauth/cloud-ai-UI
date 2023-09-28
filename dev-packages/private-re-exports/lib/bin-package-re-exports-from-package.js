"use strict";
// *****************************************************************************
// Copyright (C) 2022 Ericsson and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", { value: true });
const package_re_exports_1 = require("./package-re-exports");
const packageName = process.argv[2].trim();
(0, package_re_exports_1.readPackageJson)(packageName, { paths: [process.cwd()] })
    .then(([packageJsonPath, packageJson]) => (0, package_re_exports_1.parsePackageReExports)(packageJsonPath, packageJson))
    .then(([packageRoot, reExports]) => console.log(JSON.stringify([packageRoot, reExports])));
//# sourceMappingURL=bin-package-re-exports-from-package.js.map