import { createStandardAction } from 'typesafe-actions';
import { parse, ParseResult } from 'papaparse';

import { DataList, PDGData, DataConfig } from 'Types';

const SET_PLOT_DATA_START = 'SET_PLOT_DATA_START';
const SET_PLOT_DATA_SUCCESS = 'SET_PLOT_DATA_SUCCESS';
const SET_PLOT_DATA_FAIL = 'SET_PLOT_DATA_FAIL';

export const parsePlotData = (text: string, config: DataConfig) => {
    return (dispatch: any) => {
        dispatch(setPlotDataStart());
        parse(text, {
            complete: (results: ParseResult): void => {
                try {
                    let plotData: DataList<PDGData> = null;
                    if (!config.hasHeader) {
                        plotData = results.data.map(arr =>
                            ({ time: +arr[config.timeIndex], flow: +arr[config.flowIndex], pressure: +arr[config.pressureIndex] })
                        );
                    } else {
                        const keys = text.split('\n', 1)[0].split(',');
                        plotData = results.data.map(obj => {
                            return { time: +obj[keys[config.timeIndex].trim()], flow: +obj[keys[config.flowIndex].trim()], pressure: +obj[keys[config.pressureIndex].trim()] };
                        }
                        );
                    }
                    dispatch(setPlotDataSuccess(plotData));
                } catch (err) {
                    dispatch(setPlotDataFail(err.message));
                }
            },
            header: config.hasHeader,
            skipEmptyLines: true,
            worker: false,
        });
    };
};

export const setPlotDataStart = createStandardAction(SET_PLOT_DATA_START)<void>();
export const setPlotDataSuccess = createStandardAction(SET_PLOT_DATA_SUCCESS)<DataList<PDGData>>();
export const setPlotDataFail = createStandardAction(SET_PLOT_DATA_FAIL)<string>();
