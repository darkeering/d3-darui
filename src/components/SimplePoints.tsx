import * as d3 from "d3";
import React, { Component } from "react";
import { ColorSheet } from "../constants/color";

export default class SimplePoints extends Component {
  data = [
    [5, 66],
    [7, 55],
    [4, 99],
    [11, 78],
    [28, 65],
    [7, 88],
    [5, 56],
    [2, 60],
    [4, 57],
    [6, 98],
    [27, 33],
    [26, 77],
    [23, 95],
    [34, 87],
    [7, 68],
    [1, 68],
    [2, 60],
    [22, 84],
    [6, 96],
    [13, 87],
  ];
  componentDidMount(): void {
    const data = this.data;
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 500;
    const margin = { top: 80, left: 60, right: 60, bottom: 80 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const chart = d3
      .select(this.chartRef)
      .attr("class", "chart")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`);

    const xMax = d3.max(data, (d) => d[0]);
    const yMax = d3.max(data, (d) => d[1]);
    const xScale = d3
      .scaleLinear()
      .range([0, width])
      .domain([0, xMax as any]);
    const yScale = d3
      .scaleLinear()
      .range([0, height])
      .domain([yMax as any, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const main = chart
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    main
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .append("text")
      .text("激烈运动年限(年)")
      .attr("fill", "#000")
      .attr('transform', `translate(${width}, 20)`)
    main
      .append("g")
      .call(yAxis)
      .append("text")
      .text("健康指数 (分)")
      .attr("fill", "#000");

    let tempTip: any;
    let createTip = function (event: any, d: any) {
      // @ts-ignore
      const tar = this.getBoundingClientRect()
      
      const tip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .html(() => `<p>激烈运动年限: ${d[0]}</p><p>健康指数: ${d[1]}</p>`)
        .datum(function () {
          return this;
        })
        .attr("style", (p: any) => {
          return `position: absolute; left: ${
            tar.x + tar.width / 2 - p.offsetWidth / 2
          }px; top: ${
            tar.y - p.offsetHeight - 10
          }px;background-color: rgba(0,0,0,0.5);color: rgba(255,255,255); border-radius: 4px`;
        });

      tempTip = tip;
    };

    main
      .selectAll("point")
      .data(data)
      .enter()
      .append("circle")
      .on("mouseenter", createTip)
      .on("mouseout", () => tempTip.remove())
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("fill", (d, i) => ColorSheet[i])
      .attr("r", "0")
      .transition()
      .duration(250)
      .attr("r", "10");

    chart
      .append("text")
      .text("[模拟]激烈运动年限与健康指数之间的关系抽样检查")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${containerWidth / 2}, ${margin.top / 2})`)
      .attr("fill", "#000")
      .attr("font-weight", 700);
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
