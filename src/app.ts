import d3 = require("d3");
import papa = require("papaparse");
import { Axis } from "d3";
import $ = require("jquery");
import "bootstrap/dist/css/bootstrap.min.css";

type selection = d3.Selection<d3.BaseType, {}, HTMLElement, any>;
type selectionSVG = d3.Selection<SVGGElement, {}, HTMLElement, any>;
type margins = { top: number, bottom: number, left: number, right: number };
type linearAxis = Axis<number | { valueOf(): number; }>;
type plotData = { id: string, values: [number, number][] };

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

const svg: selection = d3.select("svg");
let aspect: number = <any>svg.attr("width") / <any>svg.attr("height");

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



$(window).on("resize", function (): void {
        let chart: JQuery<HTMLElement> = $("#chart");
        let container: JQuery<HTMLElement> = chart.parent();
        let targetWidth: number = container.width();
        chart.attr("width", targetWidth);
        chart.attr("height", Math.round(targetWidth / aspect));
    }).trigger("resize");

function drawPlot(data: DataFrame[]): void {
    let plotMargins: margins = {
        top: 20,
        bottom: 110,
        left: 40,
        right: 20
    };
    let plotMargins2: margins = {
        top: 430,
        bottom: 30,
        left: 40,
        right: 20
    };

    let plotGroup: selectionSVG = svg.append<SVGGElement>("g")
        .classed("plot", true)
        .attr("transform", `translate(${plotMargins.left},${plotMargins.top})`);

    let width: number = <any>svg.attr("width");
    let height : number = <any>svg.attr("height");

    let plotWidth: number = width - plotMargins.left - plotMargins.right;
    let plotHeight: number = height - plotMargins.top - plotMargins.bottom;
    let plotHeight2: number = height - plotMargins2.top - plotMargins2.bottom;

    let xScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(data, d => d.time));
    let xAxis: linearAxis = d3.axisBottom(xScale);
    let xAxisGroup: selectionSVG = plotGroup.append<SVGGElement>("g")
        .classed("x", true)
        .classed("axis", true)
        .attr("transform", `translate(${0},${plotHeight})`)
        .call(xAxis);

    /* let x2Scale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .range([0, width])
        .domain(xScale.domain());
    let x2Axis: linearAxis = d3.axisBottom(x2Scale);
    let x2AxisGroup: selectionSVG = plotGroup.append<SVGGElement>("g")
        .classed("x2", true)
        .classed("axis", true)
        .attr("transform", `translate(${0},${plotHeight2})`)
        .call(x2Axis); */

    let yScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .range([plotHeight, 0])
        .domain([d3.min(data, d => d.flow), d3.max(data, d => d.pressure)]);
    let yAxis: linearAxis = d3.axisLeft(yScale);
    let yAxisGroup: selectionSVG = plotGroup.append<SVGGElement>("g")
        .classed("y", true)
        .classed("axis", true)
        .call(yAxis);

    let y2Scale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .range([plotHeight2, 0])
        .domain(yScale.domain());

    let zScale: d3.ScaleOrdinal<string, string> = d3.scaleOrdinal(d3.schemeCategory10);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", plotWidth)
        .attr("height", plotHeight);

    let focus = svg.append("g")
        .attr("class", "focus")
        .attr("translate", `translate(${plotMargins.left},${plotMargins.top})`);

    let context = svg.append("g")
        .attr("class", "context")
        .attr("transform", `translate(${plotMargins2.left},${plotMargins2.top})`);

    /* let brush: d3.BrushBehavior<{}> = d3.brushX()
        .extent([[0, 0], [plotWidth, plotHeight2]])
        .on("brush end", function(): void {
            if(d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") {
                return; // ignore brush-by-zoom
            }
            let s: any = d3.event.selection || x2Scale.range();
            xScale.domain(s.map(x2Scale.invert, x2Scale));
            focus.selectAll("path.line").attr("d", (type, d: any) => d.values);
            focus.select<SVGGElement>(".x.axis").call(xAxis);
            focus.select<SVGGElement>(".y.axis").call(yAxis);
        }); */

    let pressure1: d3.Line<[number, number]> = d3.line()
        .curve(d3.curveBasis)
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));

    /*     let pressure2: d3.Line<[number, number]> = d3.line()
            .curve(d3.curveBasis)
            .x(d => x2Scale(d[0]))
            .y(d => y2Scale(d[1])); */

    let flow1: d3.Line<[number, number]> = d3.line()
        .curve(d3.curveBasis)
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));

    /* let flow2: d3.Line<[number, number]> = d3.line()
        .curve(d3.curveBasis)
        .x(d => x2Scale(d[0]))
        .y(d => y2Scale(d[1])); */

    const lines: d3.Line<[number, number]>[] = [pressure1, flow1];

    let timePressure: plotData = { id: "Pressure", values: [] };
    let timeFlow: plotData = { id: "Flow", values: [] };
    for (let i: number = 0; i < data.length; i++) {
        const d: DataFrame = data[i];
        timePressure.values.push([d.time, d.pressure]);
        timeFlow.values.push([d.time, d.flow]);
    }

    let collectedData: plotData[] = [timePressure, timeFlow];

    zScale.domain(collectedData.map(d => d.id.toString()));

    let plot: d3.Selection<d3.BaseType, plotData, SVGGElement, any> = plotGroup.selectAll(".plot")
        .data(collectedData)
        .enter().append("g")
        .attr("class", "plot");

    plot.exit().remove();

    lines.forEach(line => {
        plot.append("path")
            .attr("class", "line")
            .attr("d", d => line(d.values))
            .style("stroke", d => zScale(d.id))
            .style("fill", "transparent");
    });
}

function readData(text: File, hasHeader: boolean): void {
    papa.parse(text, {
        worker: true,
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
