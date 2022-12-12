import React, { Component } from "react";
import * as d3 from "d3";
import { ColorSheet } from "../constants/color";
import { simpleTip } from "../lib/SimpleTip";

export default class SimpleStackBar extends Component {
  data = [
    { date: "2011", q1: 155, q2: 200, q3: -214, q4: 234 },
    { date: "2012", q1: 165, q2: 210, q3: -244, q4: 254 },
    { date: "2013", q1: 175, q2: 230, q3: -274, q4: 274 },
    { date: "2014", q1: 185, q2: 250, q3: -304, q4: 294 },
    { date: "2015", q1: 195, q2: 270, q3: -334, q4: 314 },
    { date: "2016", q1: 205, q2: 290, q3: -364, q4: 330 },
  ];
  componentDidMount(): void {
    const data = this.data;
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 500;
    const margin = { top: 80, left: 60, right: 60, bottom: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const chart = d3
      .select(this.chartRef)
      .attr("class", "chart")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`);

    const main = chart
      .append("g")
      .attr("class", "main")
      // .attr("width", width)
      // .attr("height", height)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const keys = Object.keys(data[0]).slice(1);
    const series = d3.stack().keys(keys).offset(d3.stackOffsetDiverging)(
      data as any
    );

    const max = d3.max(series, (serie) => {
      return d3.max(serie, (d: any) => d[1]);
    });
    const min = d3.min(series, (serie) => {
      return d3.min(serie, (d: any) => d[0]);
    });

    const xScale = d3
      .scaleBand()
      .rangeRound([0, width])
      .domain(d3.map(data, (d) => d.date))
      .paddingInner(0.1);

    const yScale = d3.scaleLinear().range([0, height]).domain([max, min]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const tooltip = simpleTip(
      (d: any) => `
         <p>第一季度: ${d.data.q1}</p>
         <p>第二季度: ${d.data.q2}</p>
         <p>第三季度: ${d.data.q3}</p>
         <p>第四季度: ${d.data.q4}</p>
       `
    );

    main
      .selectAll(".stack-bar")
      .data(series)
      .enter()
      .append("g")
      .attr("fill", (d, i) => ColorSheet[i])
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .on("mouseenter", tooltip.create)
      .on("mouseout", () => {
        tooltip.remove();
      })
      .attr("x", (d: any) => xScale(d.data.date) as any)
      .attr("y", (d: any) => yScale(0))
      .attr("width", xScale.bandwidth)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", (d: any) => yScale(d[1]))
      .attr(
        "height",
        (d: any) => height - yScale(d[1]) - (height - yScale(d[0]))
      );

    main
      .append("g")
      .attr("transform", `translate(0, ${yScale(0)})`)
      .call(xAxis);
    main.append("g").call(yAxis);


    

  }
  chartRef: any;
  render() {
    return (
      <div>
        <svg ref={(r) => (this.chartRef = r)}></svg>
      </div>
    );
  }
}
