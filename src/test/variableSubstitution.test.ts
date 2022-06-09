/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';

import { substitute } from '../spec-common/variableSubstitution';
import { URI } from 'vscode-uri';

describe('Variable substitution', function () {

	it(`environment variables`, async () => {
		const raw = {
			foo: 'bar${env:baz}bar'
		};
		const result = substitute({
			platform: 'linux',
			localWorkspaceFolder: '/foo/bar',
			containerWorkspaceFolder: '/baz/blue',
			configFile: URI.file('/foo/bar/baz.json'),
			env: {
				baz: 'somevalue'
			},
		}, raw);
		assert.strictEqual(result.foo, 'barsomevaluebar');
	});

	it(`localWorkspaceFolder`, async () => {
		const raw = {
			foo: 'bar${localWorkspaceFolder}bar'
		};
		const result = substitute({
			platform: 'linux',
			localWorkspaceFolder: '/foo/bar',
			containerWorkspaceFolder: '/baz/blue',
			configFile: URI.file('/foo/bar/baz.json'),
			env: {
				baz: 'somevalue'
			},
		}, raw);
		assert.strictEqual(result.foo, 'bar/foo/barbar');
	});

	it(`containerWorkspaceFolder`, async () => {
		const raw = {
			foo: 'bar${containerWorkspaceFolder}bar'
		};
		const result = substitute({
			platform: 'linux',
			localWorkspaceFolder: '/foo/bar',
			containerWorkspaceFolder: '/baz/blue',
			configFile: URI.file('/foo/bar/baz.json'),
			env: {
				baz: 'somevalue'
			},
		}, raw);
		assert.strictEqual(result.foo, 'bar/baz/bluebar');
	});

	it(`localWorkspaceFolderBasename and containerWorkspaceFolder`, async () => {
		const raw = {
			foo: 'bar${containerWorkspaceFolder}bar'
		};
		const result = substitute({
			platform: 'linux',
			localWorkspaceFolder: '/foo/red',
			containerWorkspaceFolder: '/baz/${localWorkspaceFolderBasename}',
			configFile: URI.file('/foo/bar/baz.json'),
			env: {
				baz: 'somevalue'
			},
		}, raw);
		assert.strictEqual(result.foo, 'bar/baz/redbar');
	});
});