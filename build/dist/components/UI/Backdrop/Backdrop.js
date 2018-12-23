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
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var styles_1 = require("@material-ui/core/styles");
var styles = {
    backdrop: {
        width: '100%',
        height: '100%',
        position: 'fixed',
        zIndex: 100,
        left: 0,
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};
var Backdrop = /** @class */ (function (_super) {
    __extends(Backdrop, _super);
    function Backdrop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Backdrop.prototype.render = function () {
        var classes = this.props.classes;
        return this.props.show ? React.createElement("div", { className: classes.backdrop, onClick: this.props.clicked }) : null;
    };
    return Backdrop;
}(React.Component));
exports.default = styles_1.withStyles(styles)(Backdrop);
//# sourceMappingURL=Backdrop.js.map