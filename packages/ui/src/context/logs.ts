import {createContext} from '@lit-labs/context';

export declare type Logs = {timestamp, message}[]

export const LogsContext = createContext<Logs>('logs');