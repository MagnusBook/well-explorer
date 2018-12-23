"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var ReactDOM = __importStar(require("react-dom"));
var react_redux_1 = require("react-redux");
require("./index.css");
var App_1 = __importDefault(require("./App"));
var registerServiceWorker_1 = __importDefault(require("./registerServiceWorker"));
var store_1 = __importDefault(require("./store/store"));
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
var app = (React.createElement(react_redux_1.Provider, { store: store_1.default },
    React.createElement(App_1.default, null)));
ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker_1.default();
//# sourceMappingURL=index.js.map