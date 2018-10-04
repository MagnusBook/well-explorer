import d3 = require("d3");
import papa = require("papaparse");
import { Axis, line } from "d3";
import $ = require("jquery");
import "bootstrap/dist/css/bootstrap.min.css";

type selection = d3.Selection<d3.BaseType, {}, HTMLElement, any>;
type selectionSVG = d3.Selection<SVGGElement, {}, HTMLElement, any>;
type margins = { top: number, bottom: number, left: number, right: number };
type linearAxis = Axis<number | { valueOf(): number; }>;
type plotData = { id: string, values: [number, number][] };
type plotSelection = d3.Selection<d3.BaseType, plotData, d3.BaseType, any>;

class DataFrame {
    time: number;
    flow: number;
    pressure: number;

    constructor(time: number, flow: number, pressure: number) {
        this.time = time;
        this.flow = flow;
        this.pressure = pressure;
    }
}

const plotMargins: margins = {
    top: 10,
    bottom: 100,
    left: 40,
    right: 10
};
const plotMargins2: margins = {
    top: 430,
    bottom: 40,
    left: 40,
    right: 10
};

const svg: selection = d3.select("svg");
let aspect: number = <any> svg.attr("width") / <any> svg.attr("height");

let width: number = <any> svg.attr("width");
let height: number = <any> svg.attr("height");

let plotWidth: number = width - plotMargins.left - plotMargins.right;
let plotHeight: number = height - plotMargins.top - plotMargins.bottom;
let plotHeight2: number = height - plotMargins2.top - plotMargins2.bottom;

window.onload = function (): void {
    let fileInput: HTMLInputElement = <HTMLInputElement> document.getElementById("fileInput");

    fileInput.addEventListener("change", function (e: Event): void {
        let file: File = fileInput.files[0];
        if (file.name.split(".").slice(-1).pop() === "csv") {
            readData(file, false);
        } else {
            alert(`File type ${file.type} not supported!`);
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

function drawPlot(data: DataFrame[]): void {
    let plotGroup: selectionSVG = svg.append<SVGGElement>("g")
        .attr("transform", `translate(${plotMargins.left},${plotMargins.top})`);

    let xScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(data, d => d.time));
    let xAxis: linearAxis = d3.axisBottom(xScale);

    let x2Scale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .range([0, width])
        .domain(xScale.domain());
    let x2Axis: linearAxis = d3.axisBottom(x2Scale);

    let yScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .range([plotHeight, 0])
        .domain([d3.min(data, d => d.flow), d3.max(data, d => d.pressure)]);
    let yAxis: linearAxis = d3.axisLeft(yScale);

    let y2Scale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .range([plotHeight2, 0])
        .domain(yScale.domain());

    let zScale: d3.ScaleOrdinal<string, string> = d3.scaleOrdinal(d3.schemeCategory10);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", plotWidth)
        .attr("height", plotHeight);

    let focus: selection = plotGroup.append("g")
        .attr("class", "focus")
        .attr("translate", `translate(${plotMargins.left},${plotMargins.top})`);

    let context: selection = plotGroup.append("g")
        .attr("class", "context")
        .attr("transform", `translate(0,${plotMargins2.top})`);

    let line1: d3.Line<[number, number]> = d3.line()
        .curve(d3.curveBasis)
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));

    let line2: d3.Line<[number, number]> = d3.line()
        .curve(d3.curveBasis)
        .x(d => x2Scale(d[0]))
        .y(d => y2Scale(d[1]));

    let timePressure: plotData = { id: "Pressure", values: [] };
    let timeFlow: plotData = { id: "Flow", values: [] };
    for (let i: number = 0; i < data.length; i++) {
        const d: DataFrame = data[i];
        timePressure.values.push([d.time, d.pressure]);
        timeFlow.values.push([d.time, d.flow]);
    }

    let collectedData: plotData[] = [timePressure, timeFlow];

    zScale.domain(collectedData.map(d => d.id.toString()));

    let focusLineGroups: plotSelection = focus.selectAll("g")
        .data(collectedData)
        .enter().append("g");

    let focusLines: plotSelection = focusLineGroups.append("path")
        .attr("class", "line")
        .attr("d", d => line1(d.values))
        .style("stroke", d => zScale(d.id))
        .style("fill", "transparent")
        .attr("clip-path", "url(#clip)");

    focus.append<SVGGElement>("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${plotHeight})`)
        .call(xAxis);

    focus.append<SVGGElement>("g")
        .attr("class", "y axis")
        .call(yAxis);

    let contextLineGroups: plotSelection = context.selectAll("g")
        .data(collectedData)
        .enter().append("g");

    let contextLines: plotSelection = contextLineGroups.append("path")
        .attr("class", "line")
        .attr("d", d => line2(d.values))
        .style("stroke", d => zScale(d.id))
        .style("fill", "transparent")
        .attr("clip-path", "url(#clip)");

    context.append<SVGGElement>("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${plotHeight2})`)
        .call(x2Axis);

    let brush: d3.BrushBehavior<{}> = d3.brushX()
        .extent([[0, 0], [plotWidth, plotHeight2]])
        .on("brush end", () => {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") {
                return; // ignore brush-by-zoom
            }
            let s: any = d3.event.selection || x2Scale.range();
            xScale.domain(s.map(x2Scale.invert, x2Scale));
            focus.selectAll(".line").attr("d", (d: any) => line1(d.values));
            focus.select<SVGGElement>(".x.axis").call(xAxis);
        });

    context.append<SVGGElement>("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", plotHeight2 + 7);
}

function readData(text: File, hasHeader: boolean): void {
    papa.parse(text, {
        worker: false,
        skipEmptyLines: true,
        header: hasHeader,
        complete: function (results: papa.ParseResult, file: File): void {
            let frames: DataFrame[];
            if (!hasHeader) {
                frames = results.data.map(([time, flow, pressure]) => (new DataFrame(+time, +flow, +pressure)));
            } else {
                frames = results.data.map(({ time, flow, pressure }) => (new DataFrame(+time, +flow, +pressure)));
            }
            drawPlot(frames);
        }
    });
}
