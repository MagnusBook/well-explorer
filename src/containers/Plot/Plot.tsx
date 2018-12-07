import * as React from 'react';
import { connect } from 'react-redux';
import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft, axisRight, Axis } from 'd3-axis';
import { select } from 'd3-selection';
import { line, curveBasis } from 'd3-shape';
import { ZoomBehavior, zoom, zoomIdentity } from 'd3-zoom';
import { event } from 'd3';
import { brushX } from 'd3-brush';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { DataList, PDGData } from 'Types';

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

class Plot extends React.Component {
    render() {
        const { classes } = this.props as any;

        let plot: JSX.Element = (
            <Typography variant="h3" color="inherit" style={{ padding: '20px 0 0 20px' }}>
                Load Some PDG Data to Get Started!
            </Typography>
        );
        const data: DataList = (this.props as any).data;
        if (data && data.length > 1) {
            const x: ScaleLinear<number, number> = scaleLinear()
                .range([0, width])
                .domain([data[0].time, data[data.length - 1].time]);
            const xAxis: linearAxis = axisBottom(x);

            const x2: ScaleLinear<number, number> = scaleLinear()
                .range(x.range())
                .domain(x.domain());
            const x2Axis: linearAxis = axisBottom(x2);

            const yPressure: d3.ScaleLinear<number, number> = scaleLinear()
                .range([height, 0])
                // .domain([min(data, (d: any) => d.pressure), max(data, (d: any) => d.pressure)]);
                .domain([1000, 5000]);
            const yPressureAxis: linearAxis = axisLeft(yPressure);

            const yFlow: d3.ScaleLinear<number, number> = scaleLinear()
                .range([height, 0])
                // .domain([min(data, (d: any) => d.flow), max(data, (d: any) => d.flow)]);
                .domain([-10000, 25000]);
            const yFlowAxis: linearAxis = axisRight(yFlow);

            const y2: d3.ScaleLinear<number, number> = scaleLinear()
                .range([height2, 0])
                .domain([min(data, (d: any) => d.flow), max(data, (d: any) => d.pressure)]);

            const ids = ['Pressure', 'Flow'];
            const z: ScaleOrdinal<string, string> = scaleOrdinal(schemeCategory10)
                .domain(ids);

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

            const focusLines = valueLinesFocus.map((l, i) => (
                <path
                    className={`${classes.line} ${ids[i]}`}
                    key={'focus-' + ids[i]}
                    d={l(data) as string | undefined}
                    stroke={z(ids[i])}
                    fill="transparent"
                    clipPath="url(#clip)"
                />
            ));

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

            const contextLines = valueLinesContext.map((l, i) => (
                <path
                    className={classes.line}
                    key={'context-' + ids[i]}
                    d={l(data) as string | undefined}
                    stroke={z(ids[i])}
                    fill="transparent"
                    clipPath="url(#clip)"
                />
            ));

            const brushBehavior = brushX()
                .extent([[0, 0], [width, height2]])
                .on('brush end', () => {
                    if (event.sourceEvent && event.sourceEvent.type === 'zoom') {
                        return; // ignore brush-by-zoom
                    }
                    const s: any = event.selection || x2.range();
                    x.domain(s.map(x2.invert, x2));
                    const focus = select('.focus');
                    focus.selectAll('.line.Pressure').attr('d', (d: PDGData[]) => valueLinesFocus[0](d));
                    focus.selectAll('.line.Flow').attr('d', (d: PDGData[]) => valueLinesFocus[1](d));
                    focus.select<SVGGElement>('.axis.axis--x').call(xAxis);
                    select('svg').select('.zoom').call((zoomBehavior as any).transform, zoomIdentity
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
                    const focus = select('.focus');
                    focus.selectAll('.line.Pressure').attr('d', (d: PDGData[]) => valueLinesFocus[0](d));
                    focus.selectAll('.line.Flow').attr('d', (d: PDGData[]) => valueLinesFocus[1](d));
                    focus.select<SVGGElement>('.axis.axis--x').call(xAxis);
                    select('.context').select<SVGGElement>('.brush')
                        .call(brushBehavior.move, x.range().map(t.invertX, t));
                });

            plot = (
                <svg width={svgWidth} height={svgHeight}>
                    <g className="focus" transform={`translate(${margins1.left},${margins1.top})`}>
                        <g
                            className="axis axis--x"
                            transform={`translate(${0},${height})`}
                            ref={node => select(node).call(xAxis)}
                        />
                        <g
                            className="axis axis--y"
                            stroke={z(ids[0])}
                            ref={node => select(node).call(yPressureAxis)}
                        />
                        <g
                            className="axis axis--y"
                            stroke={z(ids[1])}
                            transform={`translate(${width},0)`}
                            ref={node => select(node).call(yFlowAxis)}
                        />
                        <g>
                            {focusLines}
                        </g>
                    </g>
                    <g className="context" transform={`translate(${margins2.left},${margins2.top})`}>
                        <g
                            className="axis axis--x"
                            transform={`translate(${0},${height2})`}
                            ref={node => select(node).call(x2Axis)}
                        />
                        <g>
                            {contextLines}
                        </g>
                        <g
                            className="x brush"
                            ref={node => select(node).call(brushBehavior)}
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
                        ref={(node: any) => select(node).call(zoomBehavior)}
                    />
                </svg>
            );
        }
        return plot;
    }
}

const mapStateToProps = (state: any) => ({
    data: state.plot.plotData,
});

export default withStyles(styles)(connect(mapStateToProps)(Plot));
