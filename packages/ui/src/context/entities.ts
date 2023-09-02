import {createContext} from '@lit-labs/context';
import type { Entities } from '@easy-home/types'

export type { Entities }

export const EntitiesContext = createContext<Entities>('entities');