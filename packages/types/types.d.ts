export declare type DeviceInfo = {
  manufacturer?: string
  version?: string
}

export declare type Cover = {
  deviceInfo?: DeviceInfo
  uid: string
  name: string
  id: string
  isOpen: boolean
  type: 'cover'
  position: number
  config?: {}
}

export declare type Light = {
  deviceInfo?: DeviceInfo
  type: 'light' | 'dimmable'
  uid: string
  name: string
  id: string
  isOn: boolean
  brightness?: number
  config?: {}
}

export declare type Camera = {
  deviceInfo?: DeviceInfo
  type: 'camera'
  uid: string
  id: string
  name: string
  config?: {}
}

export declare type Doorbell = {
  deviceInfo?: DeviceInfo
  uid: string
  id: string
  name: string
  type: 'doorbell'
  hasCamera?: boolean
  config: {}
}

export declare type Entities = {
  [index: string]: Cover | Light | Camera | Doorbell
}

export type * from './setup.js'
export type * from './config.js'

export declare type EntityType = 'light' | 'dimmable' | 'cover' | 'camera' | 'speaker'