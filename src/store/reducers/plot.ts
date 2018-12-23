import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import { DataList, PDGData } from 'Types';

import * as plotActions from '../actions/plot';

export type PlotAction = ActionType<typeof plotActions>;

export type PlotState = {
    readonly hasHeader: boolean;
    readonly plotData: DataList<PDGData>;
    readonly error: string;
};

const reducer = combineReducers<PlotState, PlotAction>({
    hasHeader: (state = false, action) => {
        return state;
    },
    plotData: (state = null, action) => {
        switch (action.type) {
            case getType(plotActions.setPlotDataStart): return state;
            case getType(plotActions.setPlotDataSuccess): return action.payload;
            default: return state;
        }
    },
    error: (state = '', action) => {
        switch (action.type) {
            case getType(plotActions.setPlotDataFail): return action.payload;
            default: return state;
        }
    },
});

export default reducer;
