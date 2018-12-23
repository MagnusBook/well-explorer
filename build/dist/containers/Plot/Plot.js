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
var react_redux_1 = require("react-redux");
var d3_scale_1 = require("d3-scale");
var d3_scale_chromatic_1 = require("d3-scale-chromatic");
var d3_array_1 = require("d3-array");
var d3_axis_1 = require("d3-axis");
var d3_shape_1 = require("d3-shape");
var d3_zoom_1 = require("d3-zoom");
var d3_1 = require("d3");
var d3_brush_1 = require("d3-brush");
var index_1 = require("../../store/actions/index");
var styles_1 = require("@material-ui/core/styles");
var Typography_1 = __importDefault(require("@material-ui/core/Typography"));
var time_rate_pressure_csv_1 = __importDefault(require("../../assets/time_rate_pressure.csv"));
var styles = {
    line: {
        fill: 'none',
        strokeWidth: '2px',
    },
};
var svgWidth = 960, svgHeight = 500;
var margins1 = {
    top: 30,
    right: 50,
    bottom: 100,
    left: 50,
};
var margins2 = {
    top: 430,
    right: 50,
    bottom: 40,
    left: 50,
};
var width = svgWidth - margins1.left - margins1.right;
var height = svgHeight - margins1.top - margins1.bottom;
var height2 = svgHeight - margins2.top - margins2.bottom;
var ids = ['Pressure', 'Flow'];
var z = d3_scale_1.scaleOrdinal(d3_scale_chromatic_1.schemeCategory10)
    .domain(ids);
var Plot = /** @class */ (function (_super) {
    __extends(Plot, _super);
    function Plot() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.xAxis = React.createRef();
        _this.x2Axis = React.createRef();
        _this.yPressureAxis = React.createRef();
        _this.yFlowAxis = React.createRef();
        _this.focusPressure = React.createRef();
        _this.focusFlow = React.createRef();
        _this.injectivity = React.createRef();
        _this.contextPressure = React.createRef();
        _this.contextFlow = React.createRef();
        _this.brush = React.createRef();
        _this.zoom = React.createRef();
        // An attempt at calculating the injectivity (Pressure integral) using the method given in
        // http://article.sciencepublishinggroup.com/pdf/10.11648.j.ajam.20170502.12.pdf
        // Did not get sensible results even using this technique, probably since the data is
        // extremely concentrated at some points, while being very sparse in others.
        _this.calculateInjectivity = function (data, step) {
            var maxTime = data[data.length - 1].time;
            var res = [];
            var t = data[0].time;
            var i = 1;
            while (t < maxTime) {
                var nextStep = t + step;
                var area = 0;
                while (t < nextStep) {
                    if (t < nextStep) {
                        area += ((data[i].time - data[i - 1].time) * (data[i - 1].pressure + data[i].pressure)) / 2;
                    }
                    t += data[i].time - data[i - 1].time;
                    i++;
                }
                res.push({ time: t, injectivity: area });
            }
            return res;
        };
        return _this;
    }
    Plot.prototype.componentWillMount = function () {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', time_rate_pressure_csv_1.default, false);
        xmlhttp.send();
        if (xmlhttp.status === 200) {
            this.props.parsePlotData(xmlhttp.responseText, false);
        }
    };
    Plot.prototype.componentDidUpdate = function () {
        var _this = this;
        var classes = this.props.classes;
        var data = this.props.data;
        if (data && data.length > 1) {
            // const injectivityData = this.calculateInjectivity(data, 0.000000001);
            var x_1 = d3_scale_1.scaleLinear()
                .range([0, width])
                .domain([data[0].time, data[data.length - 1].time]);
            var xAxis_1 = d3_axis_1.axisBottom(x_1);
            d3_1.select(this.xAxis.current).call(xAxis_1);
            var x2_1 = d3_scale_1.scaleLinear()
                .range(x_1.range())
                .domain(x_1.domain());
            var x2Axis = d3_axis_1.axisBottom(x2_1);
            d3_1.select(this.x2Axis.current).call(x2Axis);
            var yPressure_1 = d3_scale_1.scaleLinear()
                .range([height, 0])
                // .domain([min(data, (d: any) => d.pressure), max(data, (d: any) => d.pressure)]);
                .domain([1000, 5000]);
            var yPressureAxis = d3_axis_1.axisLeft(yPressure_1);
            d3_1.select(this.yPressureAxis.current).call(yPressureAxis);
            var yFlow_1 = d3_scale_1.scaleLinear()
                .range([height, 0])
                // .domain([min(data, (d: any) => d.flow), max(data, (d: any) => d.flow)]);
                .domain([-10000, 25000]);
            var yFlowAxis = d3_axis_1.axisRight(yFlow_1);
            d3_1.select(this.yFlowAxis.current).call(yFlowAxis);
            var y2_1 = d3_scale_1.scaleLinear()
                .range([height2, 0])
                .domain([d3_array_1.min(data, function (d) { return d.flow; }), d3_array_1.max(data, function (d) { return d.pressure; })]);
            var valueLinesFocus_1 = [
                d3_shape_1.line()
                    .x(function (d) { return x_1(d.time); })
                    .y(function (d) { return yPressure_1(d.pressure); })
                    .curve(d3_shape_1.curveBasis),
                d3_shape_1.line()
                    .x(function (d) { return x_1(d.time); })
                    .y(function (d) { return yFlow_1(d.flow); })
                    .curve(d3_shape_1.curveBasis),
            ];
            d3_1.select(this.focusPressure.current).attr('d', valueLinesFocus_1[0](data))
                .attr('class', classes.line)
                .attr('stroke', z(ids[0]))
                .attr('fill', 'transparent')
                .attr('clip-path', 'url(#clip)')
                .datum(data);
            d3_1.select(this.focusFlow.current).attr('d', valueLinesFocus_1[1](data))
                .attr('class', classes.line)
                .attr('stroke', z(ids[1]))
                .attr('fill', 'transparent')
                .attr('clip-path', 'url(#clip)')
                .datum(data);
            // select(this.injectivity.current).selectAll('dot')
            //    .data(injectivityData)
            //    .enter().append('circle')
            //    .attr('r', 3)
            //    .attr('cx', (d: Injectivity) => x(d.time))
            //    .attr('cy', (d: Injectivity) => yFlow(d.injectivity));
            var valueLinesContext = [
                d3_shape_1.line()
                    .x(function (d) { return x2_1(d.time); })
                    .y(function (d) { return y2_1(d.pressure); })
                    .curve(d3_shape_1.curveBasis),
                d3_shape_1.line()
                    .x(function (d) { return x2_1(d.time); })
                    .y(function (d) { return y2_1(d.flow); })
                    .curve(d3_shape_1.curveBasis),
            ];
            d3_1.select(this.contextPressure.current).attr('d', valueLinesContext[0](data))
                .attr('class', classes.line)
                .attr('stroke', z(ids[0]))
                .attr('fill', 'transparent')
                .attr('clip-path', 'url(#clip)')
                .datum(data);
            d3_1.select(this.contextFlow.current).attr('d', valueLinesContext[1](data))
                .attr('class', classes.line)
                .attr('stroke', z(ids[1]))
                .attr('fill', 'transparent')
                .attr('clip-path', 'url(#clip)')
                .datum(data);
            var brushBehavior_1 = d3_brush_1.brushX()
                .extent([[0, 0], [width, height2]])
                .on('brush end', function () {
                if (d3_1.event.sourceEvent && d3_1.event.sourceEvent.type === 'zoom') {
                    return; // ignore brush-by-zoom
                }
                var s = d3_1.event.selection || x2_1.range();
                x_1.domain(s.map(x2_1.invert, x2_1));
                d3_1.select(_this.focusPressure.current).attr('d', function (d) { return valueLinesFocus_1[0](d); });
                d3_1.select(_this.focusFlow.current).attr('d', function (d) { return valueLinesFocus_1[1](d); });
                d3_1.select(_this.injectivity.current).selectAll('dot').selectAll('circle')
                    .attr('cx', function (d) { return x_1(d.time); })
                    .attr('cy', function (d) { return yFlow_1(d.injectivity); });
                d3_1.select(_this.xAxis.current).call(xAxis_1);
                d3_1.select(_this.zoom.current).call(zoomBehavior_1.transform, d3_zoom_1.zoomIdentity
                    .scale(width / (s[1] - s[0]))
                    .translate(-s[0], 0));
            });
            var zoomBehavior_1 = d3_zoom_1.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([[0, 0], [width, height]])
                .extent([[0, 0], [width, height]])
                .on('zoom', function () {
                if (d3_1.event.sourceEvent && d3_1.event.sourceEvent.type === 'brush') {
                    return; // ignore zoom-by-brush
                }
                var t = d3_1.event.transform;
                x_1.domain(t.rescaleX(x2_1).domain());
                d3_1.select(_this.focusPressure.current).attr('d', function (d) { return valueLinesFocus_1[0](d); });
                d3_1.select(_this.focusFlow.current).attr('d', function (d) { return valueLinesFocus_1[1](d); });
                console.log(d3_1.select(_this.injectivity.current));
                d3_1.select(_this.injectivity.current).selectAll('dot').selectAll('circle')
                    .attr('cx', function (d) { return x_1(d.time); })
                    .attr('cy', function (d) { return yFlow_1(d.injectivity); });
                d3_1.select(_this.xAxis.current).call(xAxis_1);
                d3_1.select(_this.brush.current)
                    .call(brushBehavior_1.move, x_1.range().map(t.invertX, t));
            });
            d3_1.select(this.brush.current).call(brushBehavior_1);
            d3_1.select(this.zoom.current).call(zoomBehavior_1);
        }
    };
    Plot.prototype.render = function () {
        var plot = (React.createElement(Typography_1.default, { variant: "h3", color: "inherit", style: { padding: '20px 0 0 20px' } }, "Load Some PDG Data to Get Started!"));
        if (this.props.data) {
            plot = (React.createElement("svg", { width: svgWidth, height: svgHeight },
                React.createElement("g", { transform: "translate(" + margins1.left + "," + margins1.top + ")" },
                    React.createElement("g", { className: "axis axis--x", transform: "translate(" + 0 + "," + height + ")", ref: this.xAxis }),
                    React.createElement("g", { className: "axis axis--y", stroke: z(ids[0]), ref: this.yPressureAxis }),
                    React.createElement("g", { className: "axis axis--y", stroke: z(ids[1]), transform: "translate(" + width + ",0)", ref: this.yFlowAxis }),
                    React.createElement("g", null,
                        React.createElement("g", { ref: this.injectivity }),
                        React.createElement("path", { ref: this.focusPressure }),
                        React.createElement("path", { ref: this.focusFlow }))),
                React.createElement("g", { transform: "translate(" + margins2.left + "," + margins2.top + ")" },
                    React.createElement("g", { className: "axis axis--x", transform: "translate(" + 0 + "," + height2 + ")", ref: this.x2Axis }),
                    React.createElement("g", null,
                        React.createElement("path", { ref: this.contextPressure }),
                        React.createElement("path", { ref: this.contextFlow })),
                    React.createElement("g", { className: "x brush", ref: this.brush },
                        React.createElement("rect", { y: -6, height: height2 + 7 }))),
                React.createElement("defs", null,
                    React.createElement("clipPath", { id: "clip" },
                        React.createElement("rect", { width: width, height: height }))),
                React.createElement("rect", { className: "zoom", width: width, height: height, fill: "transparent", transform: "translate(" + margins1.left + "," + margins1.top + ")", ref: this.zoom }),
                React.createElement("rect", { x: width - 100, y: 30, rx: "5px", width: 140, height: 40, stroke: "darkgray", fill: "white" }),
                React.createElement("text", { x: width - 90, y: 40, dy: "0.32em", style: { fontWeight: 'bold' }, stroke: z(ids[0]) }, ids[0]),
                React.createElement("text", { x: width - 90, y: 40 + 20, dy: "0.32em", style: { fontWeight: 'bold' }, stroke: z(ids[1]) }, ids[1])));
        }
        return plot;
    };
    return Plot;
}(React.Component));
var mapStateToProps = function (state) { return ({
    data: state.plot.plotData,
}); };
var mapDispatchToProps = function (dispatch) { return ({
    parsePlotData: function (text, hasHeader) { return dispatch(index_1.parsePlotData(text, hasHeader)); },
}); };
exports.default = styles_1.withStyles(styles)(react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Plot));
//# sourceMappingURL=Plot.js.map