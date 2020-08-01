import React from 'react'
import * as d3 from 'd3';
import * as crossfilter from "crossfilter2/crossfilter";
import { ResponsiveBar } from '@nivo/bar'



const Bar = (props) => {
    const {x,y,margin,data,height} = props;
    const cx=crossfilter(data)
    const dimension = cx.dimension(d=> d[x]);
    const group = dimension.group().reduce(
        /* callback for when data is added to the current filter results */
        (p, v) => {
            ++p.count;
            p.sum += v[y];
            p.avg = p.sum / p.count;
            return p;
        },
        /* callback for when data is removed from the current filter results */
        (p, v) => {
            --p.count;
            p.sum += v[y];
            p.avg = p.sum / p.count;
            return p;
        },
        /* initialize p */
        () => ({
            count: 0,
            sum: 0,
            avg: 0
        })
    );
    

    return(
    <div style={{ height: height }}>
        <ResponsiveBar
            margin={margin}
            padding={0.2}
            data={group.top(Infinity).map(d=>{d.avg=d.value.avg;return d;}).sort((a, b) => d3.ascending(a.avg, b.avg))}
            indexBy="key"
            enableGridX={true}
            enableGridY={true}
            keys={['avg']}
            colors={["#F1E15B"]}
            borderWidth={3}
            borderColor="#000"
            enableLabel={true}
            labelFormat={v => `${d3.format("($,.1f")(v)}`}
            labelSkipWidth={20}
            tooltipFormat={v => `${d3.format("($,.1f")(v)}`}
            isInteractive={true}
            animate={false}
            layout="horizontal"
        />
    </div>
)
}
export default Bar;