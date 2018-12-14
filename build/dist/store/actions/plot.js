"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typesafe_actions_1 = require("typesafe-actions");
var papaparse_1 = require("papaparse");
var SET_PLOT_DATA_START = 'SET_PLOT_DATA_START';
var SET_PLOT_DATA_SUCCESS = 'SET_PLOT_DATA_SUCCESS';
var SET_PLOT_DATA_FAIL = 'SET_PLOT_DATA_FAIL';
exports.parsePlotData = function (text, hasHeader) {
    return function (dispatch) {
        dispatch(exports.setPlotDataStart());
        papaparse_1.parse(text, {
            complete: function (results) {
                try {
                    var plotData = null;
                    if (!hasHeader) {
                        plotData = results.data.map(function (_a) {
                            var time = _a[0], flow = _a[1], pressure = _a[2];
                            return ({ time: +time, flow: +flow, pressure: +pressure });
                        });
                    }
                    else {
                        plotData = results.data.map(function (_a) {
                            var time = _a.time, flow = _a.flow, pressure = _a.pressure;
                            return ({ time: +time, flow: +flow, pressure: +pressure });
                        });
                    }
                    dispatch(exports.setPlotDataSuccess(plotData));
                }
                catch (err) {
                    dispatch(exports.setPlotDataFail(err.message));
                }
            },
            header: hasHeader,
            skipEmptyLines: true,
            worker: false,
        });
    };
};
exports.setPlotDataStart = typesafe_actions_1.createStandardAction(SET_PLOT_DATA_START)();
exports.setPlotDataSuccess = typesafe_actions_1.createStandardAction(SET_PLOT_DATA_SUCCESS)();
exports.setPlotDataFail = typesafe_actions_1.createStandardAction(SET_PLOT_DATA_FAIL)();
//# sourceMappingURL=plot.js.map