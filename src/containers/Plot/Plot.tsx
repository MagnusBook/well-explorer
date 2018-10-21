import * as React from 'react';
import { connect } from 'react-redux';
import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft, Axis } from 'd3-axis';
import { select } from 'd3-selection';
import { line, curveBasis } from 'd3-shape';

import Typography from '@material-ui/core/Typography';

import Types from 'Types';

type margins = { top: number; right: number; bottom: number; left: number };
type linearAxis = Axis<number | { valueOf(): number }>;

const svgWidth = 960,
    svgHeight = 500;

const margins1: margins = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 40,
};

const margins2: margins = {
    top: 430,
    right: 10,
    bottom: 40,
    left: 40,
};

const width = svgWidth - margins1.left - margins1.right;
const height = svgHeight - margins1.top - margins1.bottom;
const height2 = svgHeight - margins2.top - margins2.bottom;

class Plot extends React.Component {
    render() {
        let plot: JSX.Element = (
            <Typography variant="h3" color="inherit" style={{ padding: '20px 0 0 20px' }}>
                Load Some PDG Data to Get Started!
            </Typography>
        );
        const data: Types.DataList = (this.props as any).data;
        if (data && data.length > 1) {
            const x: ScaleLinear<number, number> = scaleLinear()
                .range([0, width])
                .domain([data[0].time, data[data.length - 1].time]);
            const xAxis: linearAxis = axisBottom(x);

            const x2: ScaleLinear<number, number> = scaleLinear()
                .range(x.range())
                .domain(x.domain());
            const x2Axis: linearAxis = axisBottom(x2);

            const y: d3.ScaleLinear<number, number> = scaleLinear()
                .range([height, 0])
                .domain([min(data, (d: any) => d.flow), max(data, (d: any) => d.pressure)]);
            const yAxis: linearAxis = axisLeft(y);

            const y2: d3.ScaleLinear<number, number> = scaleLinear()
                .range([height2, 0])
                .domain(y.domain());
            // const y2Axis: linearAxis = axisLeft(y2);

            const z: ScaleOrdinal<string, string> = scaleOrdinal(schemeCategory10);

            const ids = ['Flow', 'Pressure'];

            const valueLinesFocus = [
                line<Types.PDGData>()
                    .x(d => x(d.time))
                    .y(d => y(d.flow))
                    .curve(curveBasis),
                line<Types.PDGData>()
                    .x(d => x(d.time))
                    .y(d => y(d.pressure))
                    .curve(curveBasis),
            ];

            const focusLines = valueLinesFocus.map((l, i) => (
                <path
                    className="line"
                    key={'focus-' + ids[i]}
                    d={l(data) as string | undefined}
                    stroke={z(ids[i])}
                    fill="transparent"
                    clip-path="url(#clip)"
                />
            ));

            const valueLinesContext = [
                line<Types.PDGData>()
                    .x(d => x2(d.time))
                    .y(d => y2(d.flow))
                    .curve(curveBasis),
                line<Types.PDGData>()
                    .x(d => x2(d.time))
                    .y(d => y2(d.pressure))
                    .curve(curveBasis),
            ];

            const contextLines = valueLinesContext.map((l, i) => (
                <path
                    className="line"
                    key={'context-' + ids[i]}
                    d={l(data) as string | undefined}
                    stroke={z(ids[i])}
                    fill="transparent"
                    clip-path="url(#clip)"
                />
            ));

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
                            ref={node => select(node).call(yAxis)}
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
                        <g className="x brush" />
                    </g>
                    <defs>
                        <clipPath id="clip">
                            <rect width={width} height={height}/>
                        </clipPath>
                    </defs>
                </svg>
            );
        }
        return plot;
    }
}

const mapStateToProps = (state: Types.RootState) => ({
    data: state.plot.plotData,
});

export default connect(mapStateToProps)(Plot);
