import {createContext} from '@lit-labs/context';


declare type Automation = {
  uid: string
  name: string
  script?: string
  actions: []
}
declare type Automations = Automation[]
export type { Automations }

export const AutomationsContext = createContext<Automations>('automations');