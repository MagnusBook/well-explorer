"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
var papa = require("papaparse");
require("bootstrap/dist/css/bootstrap.min.css");
var DataFrame = /** @class */ (function () {
    function DataFrame(time, flow, pressure) {
        this.time = time;
        this.flow = flow;
        this.pressure = pressure;
    }
    return DataFrame;
}());
var plotMargins = {
    top: 10,
    bottom: 100,
    left: 40,
    right: 10
};
var plotMargins2 = {
    top: 430,
    bottom: 40,
    left: 40,
    right: 10
};
var svg = d3.select("svg");
var aspect = svg.attr("width") / svg.attr("height");
var width = svg.attr("width");
var height = svg.attr("height");
var plotWidth = width - plotMargins.left - plotMargins.right;
var plotHeight = height - plotMargins.top - plotMargins.bottom;
var plotHeight2 = height - plotMargins2.top - plotMargins2.bottom;
window.onload = function () {
    var fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", function (e) {
        var file = fileInput.files[0];
        if (file.name.split(".").slice(-1).pop() === "csv") {
            readData(file, false);
        }
        else {
            alert("File type " + file.type + " not supported!");
        }
    });
};
/* $(window).on("resize", function (): void {
    let chart: JQuery<HTMLElement> = $("#chart");
    let container: JQuery<HTMLElement> = chart.parent();
    let targetWidth: number = container.width() - plotMargins.left - plotMargins.right;
    chart.attr("width", targetWidth);
    chart.attr("height", Math.round(targetWidth / aspect));
}).trigger("resize"); */
function drawPlot(data) {
    console.log("REEEEEEEEEEEE");
    var plotGroup = svg.append("g")
        .attr("transform", "translate(" + plotMargins.left + "," + plotMargins.top + ")");
    var xScale = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(data, function (d) { return d.time; }));
    var xAxis = d3.axisBottom(xScale);
    var x2Scale = d3.scaleLinear()
        .range([0, width])
        .domain(xScale.domain());
    var x2Axis = d3.axisBottom(x2Scale);
    var yScale = d3.scaleLinear()
        .range([plotHeight, 0])
        .domain([d3.min(data, function (d) { return d.flow; }), d3.max(data, function (d) { return d.pressure; })]);
    var yAxis = d3.axisLeft(yScale);
    var y2Scale = d3.scaleLinear()
        .range([plotHeight2, 0])
        .domain(yScale.domain());
    var zScale = d3.scaleOrdinal(d3.schemeCategory10);
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", plotWidth)
        .attr("height", plotHeight);
    var focus = plotGroup.append("g")
        .attr("class", "focus")
        .attr("translate", "translate(" + plotMargins.left + "," + plotMargins.top + ")");
    var context = plotGroup.append("g")
        .attr("class", "context")
        .attr("transform", "translate(0," + plotMargins2.top + ")");
    var brush = d3.brushX()
        .extent([[0, 0], [plotWidth, plotHeight2]])
        .on("brush end", function () {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") {
            return; // ignore brush-by-zoom
        }
        var s = d3.event.selection || x2Scale.range();
        xScale.domain(s.map(x2Scale.invert, x2Scale));
        focus.selectAll("path.line").attr("d", function (type, d) { return d.values; });
        focus.select(".x.axis").call(xAxis);
        focus.select(".y.axis").call(yAxis);
    });
    var line1 = d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return xScale(d[0]); })
        .y(function (d) { return yScale(d[1]); });
    var line2 = d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return x2Scale(d[0]); })
        .y(function (d) { return y2Scale(d[1]); });
    var timePressure = { id: "Pressure", values: [] };
    var timeFlow = { id: "Flow", values: [] };
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        timePressure.values.push([d.time, d.pressure]);
        timeFlow.values.push([d.time, d.flow]);
    }
    var collectedData = [timePressure, timeFlow];
    zScale.domain(collectedData.map(function (d) { return d.id.toString(); }));
    var focusLineGroups = focus.selectAll("g")
        .data(collectedData)
        .enter().append("g");
    var focusLines = focusLineGroups.append("path")
        .attr("class", "line")
        .attr("d", function (d) { return line1(d.values); })
        .style("stroke", function (d) { return zScale(d.id); })
        .style("fill", "transparent")
        .attr("clip-path", "url(#clip)");
    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + plotHeight + ")")
        .call(xAxis);
    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    var contextLineGroups = context.selectAll("g")
        .data(collectedData)
        .enter().append("g");
    var contextLines = contextLineGroups.append("path")
        .attr("class", "line")
        .attr("d", function (d) { return line2(d.values); })
        .style("stroke", function (d) { return zScale(d.id); })
        .style("fill", "transparent")
        .attr("clip-path", "url(#clip)");
    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + plotHeight2 + ")")
        .call(x2Axis);
    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", plotHeight2 + 7);
}
function readData(text, hasHeader) {
    papa.parse(text, {
        worker: false,
        skipEmptyLines: true,
        header: hasHeader,
        complete: function (results, file) {
            var frames;
            if (!hasHeader) {
                frames = results.data.map(function (_a) {
                    var time = _a[0], flow = _a[1], pressure = _a[2];
                    return (new DataFrame(+time, +flow, +pressure));
                });
            }
            else {
                frames = results.data.map(function (_a) {
                    var time = _a.time, flow = _a.flow, pressure = _a.pressure;
                    return (new DataFrame(+time, +flow, +pressure));
                });
            }
            drawPlot(frames);
        }
    });
}
