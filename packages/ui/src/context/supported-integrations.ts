import {createContext} from '@lit-labs/context';
import type SupportedIntegrations from '@easy-home/integrations/manifest.js'
/**
 * a lit home panel containing the configured items & desires
 * 
 * index represents the position
 */

export type { SupportedIntegrations }

export const SupportedIntegrationsContext = createContext<typeof SupportedIntegrations>('supportedIntegrations');