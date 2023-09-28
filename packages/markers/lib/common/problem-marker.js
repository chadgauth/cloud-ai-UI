"use strict";
// *****************************************************************************
// Copyright (C) 2017 Ericsson and others.
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
exports.ProblemMarker = exports.PROBLEM_KIND = void 0;
const marker_1 = require("./marker");
exports.PROBLEM_KIND = 'problem';
var ProblemMarker;
(function (ProblemMarker) {
    function is(node) {
        return marker_1.Marker.is(node) && node.kind === exports.PROBLEM_KIND;
    }
    ProblemMarker.is = is;
})(ProblemMarker = exports.ProblemMarker || (exports.ProblemMarker = {}));
//# sourceMappingURL=problem-marker.js.map