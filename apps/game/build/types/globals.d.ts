declare const __DEV__: boolean;
declare const __PROD__: boolean;

declare module '*.png' {
    const value: string;
    export = value;
}

declare module '*.jpg' {
    const value: string;
    export = value;
}

declare module '*.gif' {
    const value: string;
    export = value;
}
