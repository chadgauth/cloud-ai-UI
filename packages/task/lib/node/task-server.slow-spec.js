"use strict";
// *****************************************************************************
// Copyright (C) 2017-2019 Ericsson and others.
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
// tslint:disable-next-line:no-implicit-dependencies
require("reflect-metadata");
const task_test_container_1 = require("./test/task-test-container");
const backend_application_1 = require("@theia/core/lib/node/backend-application");
const common_1 = require("../common");
const os_1 = require("@theia/core/lib/common/os");
const node_1 = require("@theia/core/lib/node");
const terminal_protocol_1 = require("@theia/terminal/lib/common/terminal-protocol");
const expect_1 = require("@theia/core/lib/common/test/expect");
const test_web_socket_channel_1 = require("@theia/core/lib/node/messaging/test/test-web-socket-channel");
const chai_1 = require("chai");
const buffering_stream_1 = require("@theia/terminal/lib/node/buffering-stream");
// test scripts that we bundle with tasks
const commandShortRunning = './task';
const commandShortRunningOsx = './task-osx';
const commandShortRunningWindows = '.\\task.bat';
const commandLongRunning = './task-long-running';
const commandLongRunningOsx = './task-long-running-osx';
const commandLongRunningWindows = '.\\task-long-running.bat';
const bogusCommand = 'thisisnotavalidcommand';
const commandUnixNoop = 'true';
const commandWindowsNoop = 'rundll32.exe';
/** Expects argv to be ['a', 'b', 'c'] */
const script0 = './test-arguments-0.js';
/** Expects argv to be ['a', 'b', '   c'] */
const script1 = './test-arguments-1.js';
/** Expects argv to be ['a', 'b', 'c"'] */
const script2 = './test-arguments-2.js';
// we use test-resources subfolder ('<theia>/packages/task/test-resources/'),
// as workspace root, for these tests
const wsRootUri = node_1.FileUri.create(__dirname).resolve('../../test-resources');
const wsRoot = node_1.FileUri.fsPath(wsRootUri);
describe('Task server / back-end', function () {
    this.timeout(10000);
    let backend;
    let server;
    let taskServer;
    let taskWatcher;
    beforeEach(async () => {
        delete process.env['THEIA_TASK_TEST_DEBUG'];
        const testContainer = (0, task_test_container_1.createTaskTestContainer)();
        taskWatcher = testContainer.get(common_1.TaskWatcher);
        taskServer = testContainer.get(common_1.TaskServer);
        taskServer.setClient(taskWatcher.getTaskClient());
        backend = testContainer.get(backend_application_1.BackendApplication);
        server = await backend.start();
    });
    afterEach(async () => {
        const _backend = backend;
        const _server = server;
        backend = undefined;
        taskServer = undefined;
        taskWatcher = undefined;
        server = undefined;
        _backend['onStop']();
        _server.close();
    });
    it('task running in terminal - expected data is received from the terminal ws server', async function () {
        const someString = 'someSingleWordString';
        // create task using terminal process
        const command = os_1.isWindows ? commandShortRunningWindows : (os_1.isOSX ? commandShortRunningOsx : commandShortRunning);
        const taskInfo = await taskServer.run(createProcessTaskConfig('shell', `${command} ${someString}`), wsRoot);
        const terminalId = taskInfo.terminalId;
        const messagesToWaitFor = 10;
        const messages = [];
        // check output of task on terminal is what we expect
        const expected = `${os_1.isOSX ? 'tasking osx' : 'tasking'}... ${someString}`;
        // hook-up to terminal's ws and confirm that it outputs expected tasks' output
        await new Promise((resolve, reject) => {
            const setup = new test_web_socket_channel_1.TestWebSocketChannelSetup({ server, path: `${terminal_protocol_1.terminalsPath}/${terminalId}` });
            const stringBuffer = new buffering_stream_1.StringBufferingStream();
            setup.multiplexer.onDidOpenChannel(event => {
                event.channel.onMessage(e => stringBuffer.push(e().readString()));
                event.channel.onError(reject);
                event.channel.onClose(() => reject(new Error('Channel has been closed')));
            });
            stringBuffer.onData(currentMessage => {
                // Instead of waiting for one message from the terminal, we wait for several ones as the very first message can be something unexpected.
                // For instance: `nvm is not compatible with the \"PREFIX\" environment variable: currently set to \"/usr/local\"\r\n`
                messages.unshift(currentMessage);
                if (currentMessage.includes(expected)) {
                    resolve();
                }
                else if (messages.length >= messagesToWaitFor) {
                    reject(new Error(`expected sub-string not found in terminal output. Expected: "${expected}" vs Actual messages: ${JSON.stringify(messages)}`));
                }
            });
        });
    });
    it('task using raw process - task server success response shall not contain a terminal id', async function () {
        const someString = 'someSingleWordString';
        const command = os_1.isWindows ? commandShortRunningWindows : (os_1.isOSX ? commandShortRunningOsx : commandShortRunning);
        const executable = node_1.FileUri.fsPath(wsRootUri.resolve(command));
        // create task using raw process
        const taskInfo = await taskServer.run(createProcessTaskConfig('process', executable, [someString]), wsRoot);
        await new Promise((resolve, reject) => {
            const toDispose = taskWatcher.onTaskExit((event) => {
                if (event.taskId === taskInfo.taskId && event.code === 0) {
                    if (typeof taskInfo.terminalId === 'number') {
                        resolve();
                    }
                    else {
                        reject(new Error(`terminal id was expected to be a number, got: ${typeof taskInfo.terminalId}`));
                    }
                    toDispose.dispose();
                }
            });
        });
    });
    it('task is executed successfully with cwd as a file URI', async function () {
        const command = os_1.isWindows ? commandShortRunningWindows : (os_1.isOSX ? commandShortRunningOsx : commandShortRunning);
        const config = createProcessTaskConfig('shell', command, undefined, node_1.FileUri.create(wsRoot).toString());
        const taskInfo = await taskServer.run(config, wsRoot);
        await checkSuccessfulProcessExit(taskInfo, taskWatcher);
    });
    it('task is executed successfully using terminal process', async function () {
        const command = os_1.isWindows ? commandShortRunningWindows : (os_1.isOSX ? commandShortRunningOsx : commandShortRunning);
        const taskInfo = await taskServer.run(createProcessTaskConfig('shell', command, undefined), wsRoot);
        await checkSuccessfulProcessExit(taskInfo, taskWatcher);
    });
    it('task is executed successfully using raw process', async function () {
        const command = os_1.isWindows ? commandShortRunningWindows : (os_1.isOSX ? commandShortRunningOsx : commandShortRunning);
        const executable = node_1.FileUri.fsPath(wsRootUri.resolve(command));
        const taskInfo = await taskServer.run(createProcessTaskConfig('process', executable, []));
        await checkSuccessfulProcessExit(taskInfo, taskWatcher);
    });
    it('task without a specific runner is executed successfully using as a process', async function () {
        const command = os_1.isWindows ? commandWindowsNoop : commandUnixNoop;
        // there's no runner registered for the 'npm' task type
        const taskConfig = createTaskConfig('npm', command, []);
        const taskInfo = await taskServer.run(taskConfig, wsRoot);
        await checkSuccessfulProcessExit(taskInfo, taskWatcher);
    });
    it('task can successfully execute command found in system path using a terminal process', async function () {
        const command = os_1.isWindows ? commandWindowsNoop : commandUnixNoop;
        const opts = createProcessTaskConfig('shell', command, []);
        const taskInfo = await taskServer.run(opts, wsRoot);
        await checkSuccessfulProcessExit(taskInfo, taskWatcher);
    });
    it('task can successfully execute command found in system path using a raw process', async function () {
        const command = os_1.isWindows ? commandWindowsNoop : commandUnixNoop;
        const taskInfo = await taskServer.run(createProcessTaskConfig('process', command, []), wsRoot);
        await checkSuccessfulProcessExit(taskInfo, taskWatcher);
    });
    it('task using type "shell" can be killed', async function () {
        const taskInfo = await taskServer.run(createTaskConfigTaskLongRunning('shell'), wsRoot);
        const exitStatusPromise = getExitStatus(taskInfo, taskWatcher);
        taskServer.kill(taskInfo.taskId);
        const exitStatus = await exitStatusPromise;
        // node-pty reports different things on Linux/macOS vs Windows when
        // killing a process.  This is not ideal, but that's how things are
        // currently.  Ideally, its behavior should be aligned as much as
        // possible on what node's child_process module does.
        if (os_1.isWindows) {
            // On Windows, node-pty just reports an exit code of 0.
            (0, chai_1.expect)(exitStatus).equals(0);
        }
        else {
            // On Linux/macOS, node-pty sends SIGHUP by default, for some reason.
            (0, chai_1.expect)(exitStatus).equals('SIGHUP');
        }
    });
    it('task using type "process" can be killed', async function () {
        const taskInfo = await taskServer.run(createTaskConfigTaskLongRunning('process'), wsRoot);
        const exitStatusPromise = getExitStatus(taskInfo, taskWatcher);
        taskServer.kill(taskInfo.taskId);
        const exitStatus = await exitStatusPromise;
        // node-pty reports different things on Linux/macOS vs Windows when
        // killing a process.  This is not ideal, but that's how things are
        // currently.  Ideally, its behavior should be aligned as much as
        // possible on what node's child_process module does.
        if (os_1.isWindows) {
            // On Windows, node-pty just reports an exit code of 0.
            (0, chai_1.expect)(exitStatus).equals(0);
        }
        else {
            // On Linux/macOS, node-pty sends SIGHUP by default, for some reason.
            (0, chai_1.expect)(exitStatus).equals('SIGHUP');
        }
    });
    /**
     * TODO: Figure out how to debug a process that correctly starts but exits with a return code > 0
     */
    it('task using terminal process can handle command that does not exist', async function () {
        const taskInfo = await taskServer.run(createProcessTaskConfig2('shell', bogusCommand, []), wsRoot);
        const code = await new Promise((resolve, reject) => {
            taskWatcher.onTaskExit((event) => {
                if (event.taskId !== taskInfo.taskId || event.code === undefined) {
                    reject(new Error(JSON.stringify(event)));
                }
                else {
                    resolve(event.code);
                }
            });
        });
        // node-pty reports different things on Linux/macOS vs Windows when
        // killing a process.  This is not ideal, but that's how things are
        // currently.  Ideally, its behavior should be aligned as much as
        // possible on what node's child_process module does.
        if (os_1.isWindows) {
            (0, chai_1.expect)(code).equals(1);
        }
        else {
            (0, chai_1.expect)(code).equals(127);
        }
    });
    it('task using raw process can handle command that does not exist', async function () {
        const p = taskServer.run(createProcessTaskConfig2('process', bogusCommand, []), wsRoot);
        await (0, expect_1.expectThrowsAsync)(p, 'ENOENT');
    });
    it('getTasks(ctx) returns tasks according to created context', async function () {
        const context1 = 'aContext';
        const context2 = 'anotherContext';
        // create some tasks: 4 for context1, 2 for context2
        const task1 = await taskServer.run(createTaskConfigTaskLongRunning('shell'), context1);
        const task2 = await taskServer.run(createTaskConfigTaskLongRunning('process'), context2);
        const task3 = await taskServer.run(createTaskConfigTaskLongRunning('shell'), context1);
        const task4 = await taskServer.run(createTaskConfigTaskLongRunning('process'), context2);
        const task5 = await taskServer.run(createTaskConfigTaskLongRunning('shell'), context1);
        const task6 = await taskServer.run(createTaskConfigTaskLongRunning('process'), context1);
        const runningTasksCtx1 = await taskServer.getTasks(context1); // should return 4 tasks
        const runningTasksCtx2 = await taskServer.getTasks(context2); // should return 2 tasks
        const runningTasksAll = await taskServer.getTasks(); // should return 6 tasks
        if (runningTasksCtx1.length !== 4) {
            throw new Error(`Error: unexpected number of running tasks for context 1: expected: 4, actual: ${runningTasksCtx1.length}`);
        }
        if (runningTasksCtx2.length !== 2) {
            throw new Error(`Error: unexpected number of running tasks for context 2: expected: 2, actual: ${runningTasksCtx1.length}`);
        }
        if (runningTasksAll.length !== 6) {
            throw new Error(`Error: unexpected total number of running tasks for all contexts:  expected: 6, actual: ${runningTasksCtx1.length}`);
        }
        // cleanup
        await taskServer.kill(task1.taskId);
        await taskServer.kill(task2.taskId);
        await taskServer.kill(task3.taskId);
        await taskServer.kill(task4.taskId);
        await taskServer.kill(task5.taskId);
        await taskServer.kill(task6.taskId);
    });
    it('creating and killing a bunch of tasks works as expected', async function () {
        // const command = isWindows ? command_absolute_path_long_running_windows : command_absolute_path_long_running;
        const numTasks = 20;
        const taskInfo = [];
        // create a mix of terminal and raw processes
        for (let i = 0; i < numTasks; i++) {
            if (i % 2 === 0) {
                taskInfo.push(await taskServer.run(createTaskConfigTaskLongRunning('shell')));
            }
            else {
                taskInfo.push(await taskServer.run(createTaskConfigTaskLongRunning('process')));
            }
        }
        const numRunningTasksAfterCreated = await taskServer.getTasks();
        for (let i = 0; i < taskInfo.length; i++) {
            await taskServer.kill(taskInfo[i].taskId);
        }
        const numRunningTasksAfterKilled = await taskServer.getTasks();
        if (numRunningTasksAfterCreated.length !== numTasks) {
            throw new Error(`Error: unexpected number of running tasks: expected: ${numTasks}, actual: ${numRunningTasksAfterCreated.length}`);
        }
        if (numRunningTasksAfterKilled.length !== 0) {
            throw new Error(`Error: remaining running tasks, after all killed: expected: 0, actual: ${numRunningTasksAfterKilled.length}`);
        }
    });
    it('shell task should execute the command as a whole if not arguments are specified', async function () {
        const taskInfo = await taskServer.run(createProcessTaskConfig2('shell', `node ${script0} debug-hint:0a a b c`));
        const exitStatus = await getExitStatus(taskInfo, taskWatcher);
        (0, chai_1.expect)(exitStatus).eq(0);
    });
    it('shell task should fail if user defines a full command line and arguments', async function () {
        const taskInfo = await taskServer.run(createProcessTaskConfig2('shell', `node ${script0} debug-hint:0b a b c`, []));
        const exitStatus = await getExitStatus(taskInfo, taskWatcher);
        (0, chai_1.expect)(exitStatus).not.eq(0);
    });
    it('shell task should be able to exec using simple arguments', async function () {
        const taskInfo = await taskServer.run(createProcessTaskConfig2('shell', 'node', [script0, 'debug-hint:0c', 'a', 'b', 'c']));
        const exitStatus = await getExitStatus(taskInfo, taskWatcher);
        (0, chai_1.expect)(exitStatus).eq(0);
    });
    it('shell task should be able to run using arguments containing whitespace', async function () {
        const taskInfo = await taskServer.run(createProcessTaskConfig2('shell', 'node', [script1, 'debug-hint:1', 'a', 'b', '   c']));
        const exitStatus = await getExitStatus(taskInfo, taskWatcher);
        (0, chai_1.expect)(exitStatus).eq(0);
    });
    it('shell task will fail if user specify problematic arguments', async function () {
        const taskInfo = await taskServer.run(createProcessTaskConfig2('shell', 'node', [script2, 'debug-hint:2a', 'a', 'b', 'c"']));
        const exitStatus = await getExitStatus(taskInfo, taskWatcher);
        (0, chai_1.expect)(exitStatus).not.eq(0);
    });
    it('shell task should be able to run using arguments specifying which quoting method to use', async function () {
        const taskInfo = await taskServer.run(createProcessTaskConfig2('shell', 'node', [script2, 'debug-hint:2b', 'a', 'b', { value: 'c"', quoting: 'escape' }]));
        const exitStatus = await getExitStatus(taskInfo, taskWatcher);
        (0, chai_1.expect)(exitStatus).eq(0);
    });
    it('shell task should be able to run using arguments with forbidden characters but no whitespace', async function () {
        const taskInfo = await taskServer.run(createProcessTaskConfig2('shell', 'node', ['-e', 'setTimeout(console.log,1000,1+2)']));
        const exitStatus = await getExitStatus(taskInfo, taskWatcher);
        (0, chai_1.expect)(exitStatus).eq(0);
    });
});
function createTaskConfig(taskType, command, args) {
    const options = {
        label: 'test task',
        type: taskType,
        _source: '/source/folder',
        _scope: '/source/folder',
        command,
        args,
        options: { cwd: wsRoot }
    };
    return options;
}
function createProcessTaskConfig(processType, command, args, cwd = wsRoot) {
    return {
        label: 'test task',
        type: processType,
        _source: '/source/folder',
        _scope: '/source/folder',
        command,
        args,
        options: { cwd },
    };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createProcessTaskConfig2(processType, command, args) {
    return {
        label: 'test task',
        type: processType,
        command,
        args,
        options: { cwd: wsRoot },
    };
}
function createTaskConfigTaskLongRunning(processType) {
    return {
        label: '[Task] long running test task (~300s)',
        type: processType,
        _source: '/source/folder',
        _scope: '/source/folder',
        options: { cwd: wsRoot },
        command: commandLongRunning,
        windows: {
            command: node_1.FileUri.fsPath(wsRootUri.resolve(commandLongRunningWindows)),
            options: { cwd: wsRoot }
        },
        osx: {
            command: node_1.FileUri.fsPath(wsRootUri.resolve(commandLongRunningOsx))
        }
    };
}
function checkSuccessfulProcessExit(taskInfo, taskWatcher) {
    return new Promise((resolve, reject) => {
        const toDispose = taskWatcher.onTaskExit((event) => {
            if (event.taskId === taskInfo.taskId && event.code === 0) {
                toDispose.dispose();
                resolve();
            }
        });
    });
}
function getExitStatus(taskInfo, taskWatcher) {
    return new Promise((resolve, reject) => {
        taskWatcher.onTaskExit((event) => {
            if (event.taskId === taskInfo.taskId) {
                if (typeof event.signal === 'string') {
                    resolve(event.signal);
                }
                else if (typeof event.code === 'number') {
                    resolve(event.code);
                }
                else {
                    reject(new Error('no code nor signal'));
                }
            }
        });
    });
}
//# sourceMappingURL=task-server.slow-spec.js.map