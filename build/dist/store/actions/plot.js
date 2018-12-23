"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typesafe_actions_1 = require("typesafe-actions");
var papaparse_1 = require("papaparse");
var SET_PLOT_DATA_START = 'SET_PLOT_DATA_START';
var SET_PLOT_DATA_SUCCESS = 'SET_PLOT_DATA_SUCCESS';
var SET_PLOT_DATA_FAIL = 'SET_PLOT_DATA_FAIL';
exports.parsePlotData = function (text, config) {
    return function (dispatch) {
        dispatch(exports.setPlotDataStart());
        papaparse_1.parse(text, {
            complete: function (results) {
                try {
                    var plotData = null;
                    if (!config.hasHeader) {
                        plotData = results.data.map(function (arr) {
                            return ({ time: +arr[config.timeIndex], flow: +arr[config.flowIndex], pressure: +arr[config.pressureIndex] });
                        });
                    }
                    else {
                        var keys_1 = text.split('\n', 1)[0].split(',');
                        plotData = results.data.map(function (obj) {
                            return { time: +obj[keys_1[config.timeIndex].trim()], flow: +obj[keys_1[config.flowIndex].trim()], pressure: +obj[keys_1[config.pressureIndex].trim()] };
                        });
                    }
                    dispatch(exports.setPlotDataSuccess(plotData));
                }
                catch (err) {
                    dispatch(exports.setPlotDataFail(err.message));
                }
            },
            header: config.hasHeader,
            skipEmptyLines: true,
            worker: false,
        });
    };
};
exports.setPlotDataStart = typesafe_actions_1.createStandardAction(SET_PLOT_DATA_START)();
exports.setPlotDataSuccess = typesafe_actions_1.createStandardAction(SET_PLOT_DATA_SUCCESS)();
exports.setPlotDataFail = typesafe_actions_1.createStandardAction(SET_PLOT_DATA_FAIL)();
//# sourceMappingURL=plot.js.map