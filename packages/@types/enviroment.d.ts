declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_PORT: number
      POSTGRES_HOST: string
      POSTGRES_USERNAME: string
      POSTGRES_PASSWORD: string
      POSTGRES_DATABASE: string
    }
  }
}
export {}
