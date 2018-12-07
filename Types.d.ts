declare module 'Types' {
    export interface PDGData {
        time: number,
        flow: number,
        pressure: number
    }
    export type DataList = PDGData[] | null;
}