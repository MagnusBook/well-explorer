"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var plot_1 = __importDefault(require("./plot"));
var rootReducer = redux_1.combineReducers({
    plot: plot_1.default,
});
exports.default = rootReducer;
//# sourceMappingURL=root-reducer.js.map