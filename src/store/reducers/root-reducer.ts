import {combineReducers} from 'redux';

import plotReducer from './plot';

const rootReducer = combineReducers({
    plot: plotReducer,
});

export default rootReducer;
