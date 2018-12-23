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
var styles_1 = require("@material-ui/core/styles");
var Auxilary_1 = __importDefault(require("../../../hoc/Auxilary/Auxilary"));
var Backdrop_1 = __importDefault(require("../Backdrop/Backdrop"));
var styles = {
    modal: {
        position: 'fixed',
        zIndex: 500,
        backgroundColor: 'white',
        width: '70%',
        border: '1px solid #ccc',
        boxShadow: '1px 1px 1px black',
        padding: '16px',
        left: '15%',
        top: '30%',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease - out',
    },
};
var Modal = /** @class */ (function (_super) {
    __extends(Modal, _super);
    function Modal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Modal.prototype.render = function () {
        var classes = this.props.classes;
        return (React.createElement(Auxilary_1.default, null,
            React.createElement(Backdrop_1.default, { show: this.props.show, clicked: this.props.modalClosed }),
            React.createElement("div", { className: classes.modal, style: {
                    transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: this.props.show ? 1 : 0,
                } }, this.props.children)));
    };
    return Modal;
}(React.Component));
exports.default = styles_1.withStyles(styles)(Modal);
//# sourceMappingURL=Modal.js.map