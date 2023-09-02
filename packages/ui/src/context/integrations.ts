import {createContext} from '@lit-labs/context';
import type { IntegrationConfig } from '@easy-home/types'

export type { IntegrationConfig as IntegrationConfigEntries }

export const IntegrationsContext = createContext<IntegrationConfig>('integrations');