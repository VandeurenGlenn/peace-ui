export declare type DeviceInfo = {
  manufacturer?: string
  version?: string
}

export declare interface Entity {
  uid: string
  name: string
  id: string
  config?: {}
  deviceInfo?: DeviceInfo
}

export declare interface CoverState extends Entity {
  position: number
}

export declare interface Cover extends CoverState {
  isOpen: boolean
  type: 'cover'
  updateState: (state: CoverState) => void
}

export declare interface LightState extends Entity {
  isOn: boolean
  brightness?: number
}

export declare interface Light extends LightState {
  type: 'light' | 'dimmable'
  updateState: (state: LightState) => void
}

export declare type Camera = {
  deviceInfo?: DeviceInfo
  type: 'camera'
  uid: string
  id: string
  name: string
  config?: {}
  updateState: (state: {}) => void
}

export declare type Doorbell = {
  deviceInfo?: DeviceInfo
  uid: string
  id: string
  name: string
  type: 'doorbell'
  hasCamera?: boolean
  config: {}
  updateState: (state: {}) => void
}

export declare type Entities = {
  [index: string]: Cover | Light | Camera | Doorbell
}

export type * from './setup.js'
export type * from './config.js'

export declare type EntityType = 'light' | 'dimmable' | 'cover' | 'camera' | 'speaker'