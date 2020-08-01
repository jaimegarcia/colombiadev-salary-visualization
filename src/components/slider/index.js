import React, { useState,useEffect, useRef }  from 'react';
import * as d3 from 'd3';
import * as d3Slider from 'd3-simple-slider';
import './styles.css';



const Slider = props => {

    const {min,max,step,defaultValue,variable,ordinalScale,updateChart} = props;

    const ref = useRef(null);
    const [selectedValue, setSelectedValue] = useState(defaultValue);


    useEffect(
        () => {

                // New York Times
                const width = 320;
                const height = 120;
                const margin = { top: 20, right: 30, bottom: 50, left: 30 };
                
                const data = d3.range(min, max+1,step).map(d => ({
                    key: d,
                    value: d,
                }));

                const svg = d3.select(ref.current)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

                const padding = 0.1;

                const xBand = d3
                    .scaleBand()
                    .domain(data.map(d => d.key))
                    .range([margin.left, width - margin.right])
                    .padding(padding);

                const xLinear = d3
                    .scaleLinear()
                    .domain([
                        d3.min(data, d => d.key),
                        d3.max(data, d => d.key),
                    ])
                    .range([
                        margin.left + xBand.bandwidth() / 2 + xBand.step() * padding - 0.5,
                        width -
                        margin.right -
                        xBand.bandwidth() / 2 -
                        xBand.step() * padding -
                        0.5,
                    ]);

                const y = d3
                    .scaleLinear()
                    .domain([0, d3.max(data, d => d.value)])
                    .nice()
                    .range([height - margin.bottom, margin.top]);

                const yAxis = g =>g.attr('transform', `translate(${width - margin.right},0)`)
                            .call(d3.axisRight(y)
                                .tickValues([1e4])
                                .tickFormat(d3.format('($.2s'))
                            )
                            .call(g => g.select('.domain').remove());

                const slider = g =>
                g.attr('transform', `translate(0,${height - margin.bottom})`).call(
                    d3Slider
                    .sliderBottom(xLinear)
                    .step(step)
                    .ticks(4)
                    .default(defaultValue)
                    .on('onchange', value => draw(value))
                );

                const bars = svg
                    .append('g')
                    .selectAll('rect')
                    .data(data);

                const barsEnter = bars
                    .enter()
                    .append('rect')
                    .attr('x', d => xBand(d.key))
                    .attr('y', d => y(d.value))
                    .attr('height', d => y(0) - y(d.value))
                    .attr('width', xBand.bandwidth());

                svg.append('g').call(yAxis);
                svg.append('g').call(slider);

                const draw = selected => {
                    barsEnter
                        .merge(bars)
                        .attr('fill', d => (d.key === selected ? '#bad80a' : '#e0e0e0'));

                    setSelectedValue(ordinalScale?ordinalScale[selected]:selected)
                 
                    updateChart(variable,selected);

                };
                draw(defaultValue);
        },
        []
    );

    return (
        <React.Fragment>
        <p>{selectedValue}</p>
        <div id="slider-new-york-times" ref={ref}></div>

        </React.Fragment>

    )

}

export default Slider;