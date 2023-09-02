import {createContext} from '@lit-labs/context';

/**
 * a lit home panel containing the configured items & desires
 * 
 * index represents the position
 */
declare type Panel = {
  name: string,
  index: number,
  items: []
}

declare type Panels = Panel[]

export type { Panel, Panels }

export const PanelsContext = createContext<Panels>('panels');