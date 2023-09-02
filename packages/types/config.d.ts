/**
 * all types related to the local config file
 */

import { DeviceInfo, Entities } from "./types.js"


export declare type IntegrationConfigEntry = {
  deviceInfo?: DeviceInfo
  name: string
  id?: string
  available?: boolean
  entities?: Entities
  config: {}
}

export declare type IntegrationConfig = {[index: string]: any}

/**
 * IntegrationsConfig
 * 
 * @example
 * 
 * [{
 *  name: 'niko home control',
 *  id: 'deviceID',
 *  uid: 'Easy Home id given on discovery/setup'
 * }]
 */
export declare type IntegrationsConfig = IntegrationConfigEntry[]

export declare type Config = {
  ui?: {
    port: number
  },
  api?: {
    port: number
  }
  integrations?: IntegrationsConfig
}