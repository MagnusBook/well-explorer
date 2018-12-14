"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
var actions = __importStar(require("../../store/actions/index"));
var styles_1 = require("@material-ui/core/styles");
var AppBar_1 = __importDefault(require("@material-ui/core/AppBar"));
var Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
var Typography_1 = __importDefault(require("@material-ui/core/Typography"));
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var styles = function (theme) { return ({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
}); };
var Layout = /** @class */ (function (_super) {
    __extends(Layout, _super);
    function Layout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Layout.prototype.render = function () {
        var _this = this;
        var classes = this.props.classes;
        return (React.createElement("div", { className: classes.root },
            React.createElement(AppBar_1.default, { position: "static" },
                React.createElement(Toolbar_1.default, null,
                    React.createElement(Typography_1.default, { variant: "h6", color: "inherit", className: classes.grow }, "Well Explorer"),
                    React.createElement("input", { accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,\r\n                            application/vnd.ms-excel", className: classes.input, id: "contained-button-file", type: "file", onChange: function (event) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                _this.props.onFileChanged(reader.result, false);
                            };
                            if (event.target.files) {
                                reader.readAsText(event.target.files[0]);
                            }
                        } }),
                    React.createElement("label", { htmlFor: "contained-button-file" },
                        React.createElement(Button_1.default, { variant: "contained", component: "span", color: "secondary", className: classes.button }, "Load Data")))),
            React.createElement("main", { className: classes.Content }, this.props.children)));
    };
    return Layout;
}(React.Component));
var mapDispatchToProps = function (dispatch) { return redux_1.bindActionCreators({
    onFileChanged: actions.parsePlotData,
}, dispatch); };
exports.default = styles_1.withStyles(styles)(react_redux_1.connect(null, mapDispatchToProps)(Layout));
//# sourceMappingURL=Layout.js.map