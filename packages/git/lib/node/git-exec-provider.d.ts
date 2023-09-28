import { Disposable, MaybePromise } from '@theia/core/';
import { IGitExecutionOptions } from 'dugite-extra/lib/core/git';
/**
 * Provides an execution function that will be used to perform the Git commands.
 * This is the default, `NOOP`, provider and always resoles to `undefined`.
 *
 * If you would like to use, for instance, Git over SSH, you could rebind this default provider and have something like this:
 * ```typescript
 * @injectable()
 * export class GitSshExecProvider extends GitExecProvider {
 *
 *     // eslint-disable-next-line @typescript-eslint/no-explicit-any
 *     protected deferred = new Deferred<any>();
 *
 *     @postConstruct()
 *     protected init(): void {
 *         this.doInit();
 *     }
 *
 *     protected async doInit(): Promise<void> {
 *         const connection = await new SSH().connect({
 *             host: 'your-host',
 *             username: 'your-username',
 *             password: 'your-password'
 *         });
 *         const { stdout } = await connection.execCommand('which git');
 *         process.env.LOCAL_GIT_PATH = stdout.trim();
 *         this.deferred.resolve(connection);
 *     }
 *
 *     async exec(): Promise<IGitExecutionOptions.ExecFunc> {
 *         const connection = await this.deferred.promise;
 *         const gitPath = process.env.LOCAL_GIT_PATH;
 *         if (!gitPath) {
 *             throw new Error("The 'LOCAL_GIT_PATH' must be set.");
 *         }
 *         return async (
 *             args: string[],
 *             options: { cwd: string, stdin?: string },
 *             callback: (error: Error | null, stdout: string, stderr: string) => void) => {
 *
 *             const command = `${gitPath} ${args.join(' ')}`;
 *             const { stdout, stderr, code } = await connection.execCommand(command, options);
 *             // eslint-disable-next-line no-null/no-null
 *             let error: Error | null = null;
 *             if (code) {
 *                 error = new Error(stderr || `Unknown error when executing the Git command. ${args}.`);
 *                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 *                 (error as any).code = code;
 *             }
 *             callback(error, stdout, stderr);
 *         };
 *     }
 *
 *     dispose(): void {
 *         super.dispose();
 *         // Dispose your connection.
 *         this.deferred.promise.then(connection => {
 *             if (connection && 'dispose' in connection && typeof connection.dispose === 'function') {
 *                 connection.dispose();
 *             }
 *         });
 *     }
 *
 * }
 * ```
 */
export declare class GitExecProvider implements Disposable {
    /**
     * Provides a function that will be used to execute the Git commands. If resolves to `undefined`, then
     * the embedded Git executable will be used from [dugite](https://github.com/desktop/dugite).
     */
    exec(): MaybePromise<IGitExecutionOptions.ExecFunc | undefined>;
    dispose(): void;
}
export { IGitExecutionOptions };
//# sourceMappingURL=git-exec-provider.d.ts.map