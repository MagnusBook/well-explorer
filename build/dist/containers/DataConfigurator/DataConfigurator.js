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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var styles_1 = require("@material-ui/core/styles");
var Table_1 = __importDefault(require("@material-ui/core/Table"));
var TableBody_1 = __importDefault(require("@material-ui/core/TableBody"));
var TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
var TableHead_1 = __importDefault(require("@material-ui/core/TableHead"));
var TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
var Paper_1 = __importDefault(require("@material-ui/core/Paper"));
var FormControl_1 = __importDefault(require("@material-ui/core/FormControl"));
var Input_1 = __importDefault(require("@material-ui/core/Input"));
var Select_1 = __importDefault(require("@material-ui/core/Select"));
var InputLabel_1 = __importDefault(require("@material-ui/core/InputLabel"));
var FormHelperText_1 = __importDefault(require("@material-ui/core/FormHelperText"));
var MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
var Button_1 = __importDefault(require("@material-ui/core/Button"));
var actions = __importStar(require("../../store/actions/index"));
var styles = function (theme) { return ({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
    },
    preview: {
        width: '75%',
        padding: '5px',
        marginRight: '5px',
    },
    options: {
        width: '25%',
        display: 'flex',
        padding: '5px',
        flexDirection: 'column',
    },
    tableRoot: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    submitButton: {
        margin: theme.spacing.unit,
        marginTop: 'auto',
    },
}); };
var DataConfigurator = /** @class */ (function (_super) {
    __extends(DataConfigurator, _super);
    function DataConfigurator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            timeIndex: -1,
            pressureIndex: -1,
            flowIndex: -1,
        };
        _this.handleChange = function (event) {
            var _a;
            _this.setState((_a = {}, _a[event.target.name] = event.target.value, _a));
        };
        _this.handleSubmit = function () {
            var firstRow = _this.props.data.split('\n', 1)[0].split(',');
            var config = __assign({ hasHeader: firstRow.every(function (cell) { return isNaN(+cell); }) }, _this.state);
            _this.props.onConfigChanged(_this.props.data, config);
        };
        return _this;
    }
    DataConfigurator.prototype.render = function () {
        var classes = this.props.classes;
        var preview = this.props.data.split('\n', 10);
        return (React.createElement("div", { className: classes.container },
            React.createElement("div", { className: classes.preview },
                React.createElement(Paper_1.default, { className: classes.tableRoot },
                    React.createElement(Table_1.default, { className: classes.table },
                        React.createElement(TableHead_1.default, null,
                            React.createElement(TableRow_1.default, null,
                                React.createElement(TableCell_1.default, null, "Row/Column"),
                                preview[0].split(',').map(function (element, i) { return (React.createElement(TableCell_1.default, { key: "col-" + i }, i)); }))),
                        React.createElement(TableBody_1.default, null, preview.map(function (row, i) { return (React.createElement(TableRow_1.default, { key: "row-" + i },
                            React.createElement(TableCell_1.default, null, i),
                            row.split(',').map(function (element, j) { return (React.createElement(TableCell_1.default, { key: i + "-" + j }, element)); }))); }))))),
            React.createElement("div", { className: classes.options },
                React.createElement("form", { autoComplete: "off", autoCorrect: "off" },
                    React.createElement(FormControl_1.default, { className: classes.formControl },
                        React.createElement(InputLabel_1.default, { htmlFor: "time-helper" }, "Time Column"),
                        React.createElement(Select_1.default, { value: this.state.timeIndex, onChange: this.handleChange, input: React.createElement(Input_1.default, { name: "timeIndex", id: "time-helper" }) },
                            React.createElement(MenuItem_1.default, { value: -1 },
                                React.createElement("em", null, "None")),
                            preview[0].split(',').map(function (element, i) { return (React.createElement(MenuItem_1.default, { value: i, key: "time-" + i }, i.toString())); })),
                        React.createElement(FormHelperText_1.default, null, "Select the column containing the time data")),
                    React.createElement(FormControl_1.default, { className: classes.formControl },
                        React.createElement(InputLabel_1.default, { htmlFor: "pressure-helper" }, "Pressure Column"),
                        React.createElement(Select_1.default, { value: this.state.pressureIndex, onChange: this.handleChange, input: React.createElement(Input_1.default, { name: "pressureIndex", id: "pressure-helper" }) },
                            React.createElement(MenuItem_1.default, { value: -1 },
                                React.createElement("em", null, "None")),
                            preview[0].split(',').map(function (element, i) { return (React.createElement(MenuItem_1.default, { value: i, key: "pressure-" + i }, i.toString())); })),
                        React.createElement(FormHelperText_1.default, null, "Select the column containing the pressure data")),
                    React.createElement(FormControl_1.default, { className: classes.formControl },
                        React.createElement(InputLabel_1.default, { htmlFor: "flow-helper" }, "Flow Column"),
                        React.createElement(Select_1.default, { value: this.state.flowIndex, onChange: this.handleChange, input: React.createElement(Input_1.default, { name: "flowIndex", id: "flow-helper" }) },
                            React.createElement(MenuItem_1.default, { value: -1 },
                                React.createElement("em", null, "None")),
                            preview[0].split(',').map(function (element, i) { return (React.createElement(MenuItem_1.default, { value: i, key: "flow-" + i }, i.toString())); })),
                        React.createElement(FormHelperText_1.default, null, "Select the column containing the flow data"))),
                React.createElement(Button_1.default, { variant: "contained", color: "primary", className: classes.submitButton, onClick: this.handleSubmit, disabled: this.state.timeIndex < 0 || this.state.pressureIndex < 0 || this.state.flowIndex < 0 }, "Plot Data"))));
    };
    return DataConfigurator;
}(React.Component));
var mapDispatchToProps = function (dispatch) { return redux_1.bindActionCreators({
    onConfigChanged: actions.parsePlotData,
}, dispatch); };
exports.default = styles_1.withStyles(styles)(react_redux_1.connect(null, mapDispatchToProps)(DataConfigurator));
//# sourceMappingURL=DataConfigurator.js.map