/**
 * all types related to the setup flow
 */

export declare type IntegrationSetupEntryInput = {
  name: string
  description?: string
  value?: string,
  validate?: (value: any) => undefined | { error: string}
}

export declare type IntegrationSetupEntryOption = {
  name: string
  description?: string
  enabled?: boolean
}
  
  /* 
  * each entry is displayed in the config dialog
  * when multiple are defined we show a next button else submit will be displayed
  **/
export declare type IntegrationSetupEntry = {
  description?: string
  inputs?: IntegrationSetupEntryInput[]
  options?: IntegrationSetupEntryOption[]
}

export declare type IntegrationSetup = {
  name: string // name can also be taken from  the integration so maybe better to have this one optional also
  info?: string
  entries: IntegrationSetupEntry[]
}

export declare type IntegrationSetups = {
  [index: string]: {
    timestamp: EpochTimeStamp
    setup: IntegrationSetup
  }
}