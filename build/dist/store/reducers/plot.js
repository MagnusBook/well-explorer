"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var typesafe_actions_1 = require("typesafe-actions");
var plotActions = __importStar(require("../actions/plot"));
var reducer = redux_1.combineReducers({
    hasHeader: function (state, action) {
        if (state === void 0) { state = false; }
        return state;
    },
    plotData: function (state, action) {
        if (state === void 0) { state = null; }
        switch (action.type) {
            case typesafe_actions_1.getType(plotActions.setPlotDataStart): return state;
            case typesafe_actions_1.getType(plotActions.setPlotDataSuccess): return action.payload;
            default: return state;
        }
    },
    error: function (state, action) {
        if (state === void 0) { state = ''; }
        switch (action.type) {
            case typesafe_actions_1.getType(plotActions.setPlotDataFail): return action.payload;
            default: return state;
        }
    },
});
exports.default = reducer;
//# sourceMappingURL=plot.js.map