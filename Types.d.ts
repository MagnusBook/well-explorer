declare module 'Types' {
    export interface PDGData {
        time: number,
        flow: number,
        pressure: number,
    }

    export interface Injectivity {
        time: number,
        injectivity: number
    }

    export interface DataConfig {
        hasHeader: boolean,
        timeIndex: number,
        pressureIndex: number,
        flowIndex: number
    }

    export type DataList<T> = T[] | null;
}