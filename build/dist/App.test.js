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
var App_1 = __importDefault(require("./App"));
it('renders without crashing', function () {
    var div = document.createElement('div');
    ReactDOM.render(React.createElement(App_1.default, null), div);
    ReactDOM.unmountComponentAtNode(div);
});
//# sourceMappingURL=App.test.js.map