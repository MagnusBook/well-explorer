import * as React from 'react';
import { connect } from 'react-redux';
import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft, axisRight, Axis } from 'd3-axis';
import { line, curveBasis } from 'd3-shape';
import { ZoomBehavior, zoom, zoomIdentity } from 'd3-zoom';
import { event, select } from 'd3';
import { brushX } from 'd3-brush';

import { parsePlotData } from '../../store/actions/index';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { DataList, PDGData, Injectivity } from 'Types';
import SampleData from '../../assets/time_rate_pressure.csv';

type margins = { top: number; right: number; bottom: number; left: number };
type linearAxis = Axis<number | { valueOf(): number }>;

const styles = {
    line: {
        fill: 'none',
        strokeWidth: '2px',
    },
};

const svgWidth = 960,
    svgHeight = 500;

const margins1: margins = {
    top: 30,
    right: 50,
    bottom: 100,
    left: 50,
};

const margins2: margins = {
    top: 430,
    right: 50,
    bottom: 40,
    left: 50,
};

const width = svgWidth - margins1.left - margins1.right;
const height = svgHeight - margins1.top - margins1.bottom;
const height2 = svgHeight - margins2.top - margins2.bottom;

const ids = ['Pressure', 'Flow'];
const z: ScaleOrdinal<string, string> = scaleOrdinal(schemeCategory10)
    .domain(ids);

class Plot extends React.Component {
    xAxis = React.createRef<SVGGElement>();
    x2Axis = React.createRef<SVGGElement>();
    yPressureAxis = React.createRef<SVGGElement>();
    yFlowAxis = React.createRef<SVGGElement>();
    focusPressure = React.createRef<SVGPathElement>();
    focusFlow = React.createRef<SVGPathElement>();
    injectivity = React.createRef<SVGGElement>();
    contextPressure = React.createRef<SVGPathElement>();
    contextFlow = React.createRef<SVGPathElement>();
    brush = React.createRef<SVGGElement>();
    zoom = React.createRef<SVGRectElement>();

    // An attempt at calculating the injectivity (Pressure integral) using the method given in
    // http://article.sciencepublishinggroup.com/pdf/10.11648.j.ajam.20170502.12.pdf
    // Did not get sensible results even using this technique, probably since the data is
    // extremely concentrated at some points, while being very sparse in others.
    calculateInjectivity = (data: DataList<PDGData>, step: number): DataList<Injectivity> => {
        const maxTime = data[data.length - 1].time;
        const res: DataList<Injectivity> = [];
        let t = data[0].time;
        let i = 1;
        while (t < maxTime) {
            const nextStep = t + step;
            let area = 0;
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
    }

    componentWillMount() {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', SampleData, false);
        xmlhttp.send();
        if (xmlhttp.status === 200) {
            (this.props as any).parsePlotData(xmlhttp.responseText, false);
        }
    }

    componentDidUpdate() {
        const { classes } = this.props as any;
        const data: DataList<PDGData> = (this.props as any).data;
        if (data && data.length > 1) {
            // const injectivityData = this.calculateInjectivity(data, 0.000000001);

            const x: ScaleLinear<number, number> = scaleLinear()
                .range([0, width])
                .domain([data[0].time, data[data.length - 1].time]);
            const xAxis: linearAxis = axisBottom(x);
            select(this.xAxis.current).call(xAxis);

            const x2: ScaleLinear<number, number> = scaleLinear()
                .range(x.range())
                .domain(x.domain());
            const x2Axis: linearAxis = axisBottom(x2);
            select(this.x2Axis.current).call(x2Axis);

            const yPressure: d3.ScaleLinear<number, number> = scaleLinear()
                .range([height, 0])
                // .domain([min(data, (d: any) => d.pressure), max(data, (d: any) => d.pressure)]);
                .domain([1000, 5000]);
            const yPressureAxis: linearAxis = axisLeft(yPressure);
            select(this.yPressureAxis.current).call(yPressureAxis);

            const yFlow: d3.ScaleLinear<number, number> = scaleLinear()
                .range([height, 0])
                // .domain([min(data, (d: any) => d.flow), max(data, (d: any) => d.flow)]);
                .domain([-10000, 25000]);
            const yFlowAxis: linearAxis = axisRight(yFlow);
            select(this.yFlowAxis.current).call(yFlowAxis);

            const y2: d3.ScaleLinear<number, number> = scaleLinear()
                .range([height2, 0])
                .domain([min(data, (d: any) => d.flow), max(data, (d: any) => d.pressure)]);

            const valueLinesFocus = [
                line<PDGData>()
                    .x(d => x(d.time))
                    .y(d => yPressure(d.pressure))
                    .curve(curveBasis),
                line<PDGData>()
                    .x(d => x(d.time))
                    .y(d => yFlow(d.flow))
                    .curve(curveBasis),
            ];

            select(this.focusPressure.current).attr('d', valueLinesFocus[0](data))
                .attr('class', classes.line)
                .attr('stroke', z(ids[0]))
                .attr('fill', 'transparent')
                .attr('clip-path', 'url(#clip)')
                .datum(data);

            select(this.focusFlow.current).attr('d', valueLinesFocus[1](data))
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

            const valueLinesContext = [
                line<PDGData>()
                    .x(d => x2(d.time))
                    .y(d => y2(d.pressure))
                    .curve(curveBasis),
                line<PDGData>()
                    .x(d => x2(d.time))
                    .y(d => y2(d.flow))
                    .curve(curveBasis),
            ];

            select(this.contextPressure.current).attr('d', valueLinesContext[0](data))
                .attr('class', classes.line)
                .attr('stroke', z(ids[0]))
                .attr('fill', 'transparent')
                .attr('clip-path', 'url(#clip)')
                .datum(data);

            select(this.contextFlow.current).attr('d', valueLinesContext[1](data))
                .attr('class', classes.line)
                .attr('stroke', z(ids[1]))
                .attr('fill', 'transparent')
                .attr('clip-path', 'url(#clip)')
                .datum(data);

            const brushBehavior = brushX()
                .extent([[0, 0], [width, height2]])
                .on('brush end', () => {
                    if (event.sourceEvent && event.sourceEvent.type === 'zoom') {
                        return; // ignore brush-by-zoom
                    }
                    const s: any = event.selection || x2.range();
                    x.domain(s.map(x2.invert, x2));
                    select(this.focusPressure.current).attr('d', (d: PDGData[]) => valueLinesFocus[0](d));
                    select(this.focusFlow.current).attr('d', (d: PDGData[]) => valueLinesFocus[1](d));
                    select(this.injectivity.current).selectAll('dot').selectAll('circle')
                        .attr('cx', (d: Injectivity) => x(d.time))
                        .attr('cy', (d: Injectivity) => yFlow(d.injectivity));
                    select(this.xAxis.current).call(xAxis);
                    select(this.zoom.current).call((zoomBehavior as any).transform, zoomIdentity
                        .scale(width / (s[1] - s[0]))
                        .translate(-s[0], 0));
                });

            const zoomBehavior: ZoomBehavior<Element, {}> = zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([[0, 0], [width, height]])
                .extent([[0, 0], [width, height]])
                .on('zoom', () => {
                    if (event.sourceEvent && event.sourceEvent.type === 'brush') {
                        return; // ignore zoom-by-brush
                    }
                    const t: any = event.transform;
                    x.domain(t.rescaleX(x2).domain());
                    select(this.focusPressure.current).attr('d', (d: PDGData[]) => valueLinesFocus[0](d));
                    select(this.focusFlow.current).attr('d', (d: PDGData[]) => valueLinesFocus[1](d));
                    console.log(select(this.injectivity.current));
                    select(this.injectivity.current).selectAll('dot').selectAll('circle')
                        .attr('cx', (d: Injectivity) => x(d.time))
                        .attr('cy', (d: Injectivity) => yFlow(d.injectivity));
                    select(this.xAxis.current).call(xAxis);
                    select(this.brush.current)
                        .call(brushBehavior.move, x.range().map(t.invertX, t));
                });

            select(this.brush.current).call(brushBehavior);
            select(this.zoom.current).call(zoomBehavior);
        }
    }

    render() {
        let plot: JSX.Element = (
            <Typography variant="h3" color="inherit" style={{ padding: '20px 0 0 20px' }}>
                Load Some PDG Data to Get Started!
            </Typography>
        );

        if ((this.props as any).data) {
            plot = (
                <svg width={svgWidth} height={svgHeight}>
                    <g transform={`translate(${margins1.left},${margins1.top})`}>
                        <g
                            className="axis axis--x"
                            transform={`translate(${0},${height})`}
                            ref={this.xAxis}
                        />
                        <g
                            className="axis axis--y"
                            stroke={z(ids[0])}
                            ref={this.yPressureAxis}
                        />
                        <g
                            className="axis axis--y"
                            stroke={z(ids[1])}
                            transform={`translate(${width},0)`}
                            ref={this.yFlowAxis}
                        />
                        <g>
                            <g ref={this.injectivity} />
                            <path ref={this.focusPressure} />
                            <path ref={this.focusFlow} />
                        </g>
                    </g>
                    <g transform={`translate(${margins2.left},${margins2.top})`}>
                        <g
                            className="axis axis--x"
                            transform={`translate(${0},${height2})`}
                            ref={this.x2Axis}
                        />
                        <g>
                            <path ref={this.contextPressure} />
                            <path ref={this.contextFlow} />
                        </g>
                        <g
                            className="x brush"
                            ref={this.brush}
                        >
                            <rect y={-6} height={height2 + 7} />
                        </g>
                    </g>
                    <defs>
                        <clipPath id="clip">
                            <rect width={width} height={height} />
                        </clipPath>
                    </defs>
                    <rect
                        className="zoom"
                        width={width}
                        height={height}
                        fill="transparent"
                        transform={`translate(${margins1.left},${margins1.top})`}
                        ref={this.zoom}
                    />
                    <rect
                        x={width - 100}
                        y={30}
                        rx="5px"
                        width={140}
                        height={40}
                        stroke="darkgray"
                        fill="white"
                    />
                    <text
                        x={width - 90}
                        y={40}
                        dy="0.32em"
                        style={{ fontWeight: 'bold' }}
                        stroke={z(ids[0])}
                    >
                        {ids[0]}
                    </text>
                    <text
                        x={width - 90}
                        y={40 + 20}
                        dy="0.32em"
                        style={{ fontWeight: 'bold' }}
                        stroke={z(ids[1])}
                    >
                        {ids[1]}
                    </text>
                </svg>
            );
        }
        return plot;
    }
}

const mapStateToProps = (state: any) => ({
    data: state.plot.plotData,
});

const mapDispatchToProps = (dispatch: any) => ({
    parsePlotData: (text: string, hasHeader: boolean) => dispatch(parsePlotData(text, hasHeader)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Plot));
