declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?: string
  }
}

declare const process: {
  env: NodeJS.ProcessEnv
}

