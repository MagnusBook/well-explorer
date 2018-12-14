"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_thunk_1 = __importDefault(require("redux-thunk"));
var redux_devtools_extension_1 = require("redux-devtools-extension");
var root_reducer_1 = __importDefault(require("./reducers/root-reducer"));
var configureStore = function (initialState) {
    return redux_1.createStore(root_reducer_1.default, initialState, redux_devtools_extension_1.composeWithDevTools(redux_1.applyMiddleware(redux_thunk_1.default)));
};
var store = configureStore();
exports.default = store;
//# sourceMappingURL=store.js.map