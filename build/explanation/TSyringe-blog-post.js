"use strict";
// // taken from https://blog.logrocket.com/top-five-typescript-dependency-injection-containers/
// // TSyringe, token-based DI
// /**
//  * Interfaces
//  */
// export interface Logger {
//     log: (s: string) => void;
// }
// export interface FileSystem<D> {
//     createFile(descriptor: D, buffer: Buffer): Promise<void>;
//     readFile(descriptor: D): Promise<Buffer>;
//     updateFile(descriptor: D, buffer: Buffer): Promise<void>;
//     deleteFile(descriptor: D): Promise<void>;
// }
// export interface SettingsService {
//     upsertSettings(buffer: Buffer): Promise<void>;
//     readSettings(): Promise<Buffer>;
//     deleteSettings(): Promise<void>;
// }
// /**
//  * Implementation and lifetime decorators
//  */
// @singleton()
// export class TsyringeLogger implements Logger {
//     // ...
// }
// @singleton()
// export class TsyringeFileSystem implements FileSystem<string> {
//     // ...
// }
// export class SettingsTxtService implements SettingsService {
//     protected logger!: Logger;
//     protected fileSystem!: FileSystem<string>;
//     public setLogger(logger: SettingsTxtService["logger"]): void {
//         this.logger = logger;
//     }
//     public setFileSystem(fileSystem: SettingsTxtService["fileSystem"]): void {
//         this.fileSystem = fileSystem;
//     }
//     // ...
// }
// /**
//  * Consuming injected dependencies with a decorator
//  */
// @singleton()
// export class TokenedTsyringeSettingsTxtService extends SettingsTxtService {
//     constructor(
//         @inject("logger") protected logger: Logger,
//         @inject("fileSystem") protected fileSystem: FileSystem<string>,
//     ) {
//         super();
//     }
// }
// /**
//  * Setting up the container
//  */
//  const childContainer = container.createChildContainer();
//  childContainer.register("logger", TsyringeLogger, { lifecycle: Lifecycle.Singleton });
//  childContainer.register("fileSystem", TsyringeFileSystem, { lifecycle: Lifecycle.Singleton });
//  const logger = childContainer.resolve<FakeLogger>("logger");
//  const fileSystem = childContainer.resolve<FakeFileSystem>("fileSystem");
//  const settingsService = childContainer.resolve(TokenedTsyringeSettingsTxtService);
//# sourceMappingURL=TSyringe-blog-post.js.map