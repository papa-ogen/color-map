/// <reference types="undici" />

declare module "@figma/plugin-typings" {
  // Assuming FetchOptions and FetchResponse are types defined in the Figma typings
  const fetch: (url: string, init?: FetchOptions) => Promise<FetchResponse>;
}
