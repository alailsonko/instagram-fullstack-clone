/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv'
import find from 'find-up'
const findEnv = (): string => find.sync(process.env.ENV_FILE || '.env')
export default function (): any {
  dotenv.config({ path: findEnv() })
}
