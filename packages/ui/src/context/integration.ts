import {createContext} from '@lit-labs/context';
import type { IntegrationConfigEntry } from '@easy-home/types'

export type { IntegrationConfigEntry }

export const IntegrationContext = createContext<IntegrationConfigEntry>('integration');