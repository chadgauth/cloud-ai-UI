import type { BrowserWindowConstructorOptions } from 'electron';
export import deepmerge = require('deepmerge');
export declare type RequiredRecursive<T> = {
    [K in keyof T]-?: T[K] extends object ? RequiredRecursive<T[K]> : T[K];
};
/**
 * Base configuration for the Theia application.
 */
export interface ApplicationConfig {
    readonly [key: string]: any;
}
export declare type ElectronFrontendApplicationConfig = RequiredRecursive<ElectronFrontendApplicationConfig.Partial>;
export declare namespace ElectronFrontendApplicationConfig {
    const DEFAULT: ElectronFrontendApplicationConfig;
    interface Partial {
        /**
         * Override or add properties to the electron `windowOptions`.
         *
         * Defaults to `{}`.
         */
        readonly windowOptions?: BrowserWindowConstructorOptions;
    }
}
export declare type DefaultTheme = string | Readonly<{
    light: string;
    dark: string;
}>;
export declare namespace DefaultTheme {
    function defaultForOSTheme(theme: DefaultTheme): string;
}
/**
 * Application configuration for the frontend. The following properties will be injected into the `index.html`.
 */
export declare type FrontendApplicationConfig = RequiredRecursive<FrontendApplicationConfig.Partial>;
export declare namespace FrontendApplicationConfig {
    const DEFAULT: FrontendApplicationConfig;
    interface Partial extends ApplicationConfig {
        /**
         * The default theme for the application.
         *
         * Defaults to `dark` if the OS's theme is dark. Otherwise `light`.
         */
        readonly defaultTheme?: DefaultTheme;
        /**
         * The default icon theme for the application.
         *
         * Defaults to `none`.
         */
        readonly defaultIconTheme?: string;
        /**
         * The name of the application.
         *
         * Defaults to `Eclipse Theia`.
         */
        readonly applicationName?: string;
        /**
         * Electron specific configuration.
         *
         * Defaults to `ElectronFrontendApplicationConfig.DEFAULT`.
         */
        readonly electron?: ElectronFrontendApplicationConfig.Partial;
        /**
         * The default locale for the application.
         *
         * Defaults to "".
         */
        readonly defaultLocale?: string;
        /**
         * When `true`, the application will validate the JSON schema of the preferences on start
         * and log warnings to the console if the schema is not valid.
         *
         * Defaults to `true`.
         */
        readonly validatePreferencesSchema?: boolean;
    }
}
/**
 * Application configuration for the backend.
 */
export declare type BackendApplicationConfig = RequiredRecursive<BackendApplicationConfig.Partial>;
export declare namespace BackendApplicationConfig {
    const DEFAULT: BackendApplicationConfig;
    interface Partial extends ApplicationConfig {
        /**
         * If true and in Electron mode, only one instance of the application is allowed to run at a time.
         *
         * Defaults to `false`.
         */
        readonly singleInstance?: boolean;
    }
}
/**
 * Configuration for the generator.
 */
export declare type GeneratorConfig = RequiredRecursive<GeneratorConfig.Partial>;
export declare namespace GeneratorConfig {
    const DEFAULT: GeneratorConfig;
    interface Partial {
        /**
         * Template to use for extra preload content markup (file path or HTML).
         *
         * Defaults to `''`.
         */
        readonly preloadTemplate?: string;
    }
}
export interface NpmRegistryProps {
    /**
     * Defaults to `false`.
     */
    readonly next: boolean;
    /**
     * Defaults to `https://registry.npmjs.org/`.
     */
    readonly registry: string;
}
export declare namespace NpmRegistryProps {
    const DEFAULT: NpmRegistryProps;
}
/**
 * Representation of all backend and frontend related Theia extension and application properties.
 */
export interface ApplicationProps extends NpmRegistryProps {
    readonly [key: string]: any;
    /**
     * Whether the extension targets the browser or electron. Defaults to `browser`.
     */
    readonly target: ApplicationProps.Target;
    /**
     * Frontend related properties.
     */
    readonly frontend: {
        readonly config: FrontendApplicationConfig;
    };
    /**
     * Backend specific properties.
     */
    readonly backend: {
        readonly config: BackendApplicationConfig;
    };
    /**
     * Generator specific properties.
     */
    readonly generator: {
        readonly config: GeneratorConfig;
    };
}
export declare namespace ApplicationProps {
    type Target = keyof typeof ApplicationTarget;
    enum ApplicationTarget {
        browser = "browser",
        electron = "electron"
    }
    const DEFAULT: ApplicationProps;
}
//# sourceMappingURL=application-props.d.ts.map