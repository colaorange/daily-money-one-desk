//fix Cannot find module '/vite.svg' or its corresponding type declarations in vite
declare module '*.svg' {
    const content: string;
    export default content;
}