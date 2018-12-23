import { createStandardAction } from 'typesafe-actions';
import { parse, ParseResult } from 'papaparse';

import { DataList, PDGData } from 'Types';

const SET_PLOT_DATA_START = 'SET_PLOT_DATA_START';
const SET_PLOT_DATA_SUCCESS = 'SET_PLOT_DATA_SUCCESS';
const SET_PLOT_DATA_FAIL = 'SET_PLOT_DATA_FAIL';

export const parsePlotData = (text: string, hasHeader: boolean) => {
    return (dispatch: any) => {
        dispatch(setPlotDataStart());
        parse(text, {
            complete: (results: ParseResult): void => {
                try {
                    let plotData: DataList<PDGData> = null;
                    if (!hasHeader) {
                        plotData = results.data.map(([time, flow, pressure]) =>
                            ({ time: +time, flow: +flow, pressure: +pressure }));
                    } else {
                        plotData = results.data.map(({ time, flow, pressure }) =>
                            ({ time: +time, flow: +flow, pressure: +pressure }));
                    }
                    dispatch(setPlotDataSuccess(plotData));
                } catch (err) {
                    dispatch(setPlotDataFail(err.message));
                }
            },
            header: hasHeader,
            skipEmptyLines: true,
            worker: false,
        });
    };
};

export const setPlotDataStart = createStandardAction(SET_PLOT_DATA_START)<void>();
export const setPlotDataSuccess = createStandardAction(SET_PLOT_DATA_SUCCESS)<DataList<PDGData>>();
export const setPlotDataFail = createStandardAction(SET_PLOT_DATA_FAIL)<string>();
