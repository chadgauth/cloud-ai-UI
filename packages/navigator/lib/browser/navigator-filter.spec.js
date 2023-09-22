"use strict";
// *****************************************************************************
// Copyright (C) 2018 TypeFox and others.
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
const jsdom_1 = require("@theia/core/lib/browser/test/jsdom");
const disableJSDOM = (0, jsdom_1.enableJSDOM)();
const chai_1 = require("chai");
const navigator_filter_1 = require("./navigator-filter");
disableJSDOM();
describe('navigator-filter-glob', () => {
    const pathPrefix = 'file:///some/path/to';
    const toItem = (id) => ({ id: `${pathPrefix}${id}` });
    const itemsToFilter = [
        '/.git/',
        '/.git/a',
        '/.git/b',
        '/src/foo/',
        '/src/foo/a.js',
        '/src/foo/b.js',
        '/src/foo/a.ts',
        '/src/foo/b.ts',
        '/src/foo/test/bar/a.js',
        '/src/foo/test/bar/b.js',
        '/test/baz/bar/a.js',
        '/test/baz/bar/b.js'
    ].map(toItem);
    [
        {
            patterns: {
                '**/.git/**': true
            },
            includes: [
                '/src/foo/'
            ],
            excludes: [
                '/.git/',
                '/.git/a',
                '/.git/b'
            ]
        },
        {
            patterns: {
                '*.js': true
            },
            includes: [
                '/src/foo/a.ts',
                '/.git/'
            ],
            excludes: [
                '/src/foo/a.js',
                '/test/baz/bar/a.js'
            ]
        },
        {
            patterns: {
                '**/test/bar/**': true
            },
            includes: [
                '/test/baz/bar/a.js',
                '/test/baz/bar/b.js',
                '/.git/'
            ],
            excludes: [
                '/src/foo/test/bar/a.js',
                '/src/foo/test/bar/b.js'
            ]
        },
        {
            patterns: {
                '*.js': true,
                '**/.git/**': true
            },
            includes: [
                '/src/foo/a.ts'
            ],
            excludes: [
                '/.git/',
                '/src/foo/a.js',
                '/test/baz/bar/a.js'
            ]
        },
        {
            patterns: {
                '*.js': false,
                '**/.git/**': false
            },
            includes: [
                '/.git/',
                '/.git/a',
                '/.git/b',
                '/src/foo/',
                '/src/foo/a.js',
                '/src/foo/b.js',
                '/src/foo/a.ts',
                '/src/foo/b.ts',
                '/src/foo/test/bar/a.js',
                '/src/foo/test/bar/b.js',
                '/test/baz/bar/a.js',
                '/test/baz/bar/b.js'
            ],
            excludes: []
        }
    ].forEach((test, index) => {
        it(`${index < 10 ? `0${index + 1}` : `${index + 1}`} glob-filter: (${Object.keys(test.patterns).map(key => `${key} [${test.patterns[key]}]`).join(', ')}) `, () => {
            const filter = new navigator_filter_1.FileNavigatorFilterPredicate(test.patterns);
            const result = itemsToFilter.filter(filter.filter.bind(filter));
            test.includes.map(toItem).forEach(item => includes(result, item));
            test.excludes.map(toItem).forEach(item => excludes(result, item));
        });
    });
});
function includes(array, item, message = `Expected ${JSON.stringify(array)} to include ${JSON.stringify(item)}.`) {
    (0, chai_1.expect)(array).to.deep.include(item, message);
}
function excludes(array, item, message = `Expected ${JSON.stringify(array)} to not include ${JSON.stringify(item)}.`) {
    (0, chai_1.expect)(array).to.not.deep.include(item, message);
}
//# sourceMappingURL=navigator-filter.spec.js.map