/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'showdown-katex' {
  const showdownKatex: any;
  export default showdownKatex;
}

declare module 'visual:k-shiki-auto-import.ts' {
  type AnyHighlighterGeneric = import('shiki').HighlighterGeneric<any, any>;
  export declare function getShiki(): Promise<import('shiki').HighlighterCore>;
  export declare const dynamicLangs: {
    vue: () => Promise<typeof import('shiki/dist/langs/vue.mjs')>;
  };
  export declare const dynamicThemes: {
    vue: () => Promise<typeof import('shiki/dist/langs/vue.mjs')>;
  };
  export declare function loadLangs(shiki: AnyHighlighterGeneric, lang: string): Promise<void>;
  export declare function loadTheme(theme: string): Promise<void>;
  export declare function getShikiWithLang(lang: string): Promise<import('shiki').HighlighterCore>;
  export {};
}
