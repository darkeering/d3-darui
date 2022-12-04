import * as d3 from "d3";
import React, { Component } from "react";
import { ColorSheet } from "../constants/color";

export default class SimpleLineii extends Component {
  data = [
    { time: "00:00", pm25: 75 },
    { time: "01:00", pm25: 66 },
    { time: "02:00", pm25: 43 },
    { time: "03:00", pm25: 32 },
    { time: "04:00", pm25: 20 },
    { time: "05:00", pm25: 18 },
    { time: "06:00", pm25: 16 },
    { time: "07:00", pm25: 33 },
    { time: "08:00", pm25: 53 },
    { time: "09:00", pm25: 66 },
    { time: "10:00", pm25: 55 },
    { time: "11:00", pm25: 67 },
    { time: "12:00", pm25: 99 },
    { time: "13:00", pm25: 138 },
    { time: "14:00", pm25: 110 },
    { time: "15:00", pm25: 99 },
    { time: "16:00", pm25: 119 },
    { time: "17:00", pm25: 125 },
    { time: "18:00", pm25: 173 },
    { time: "19:00", pm25: 168 },
    { time: "20:00", pm25: 162 },
    { time: "21:00", pm25: 143 },
    { time: "22:00", pm25: 132 },
    { time: "23:00", pm25: 87 },
  ];
  componentDidMount(): void {
    const timeParse = d3.timeParse("%H:%M");
    const timeFormat: any = d3.timeFormat("%H:%M");
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 500;
    const key = "pm25";
    const data: any = this.data.map((d) => ({
      key: key,
      time: timeParse(d.time),
      value: d[key],
    }));
    const margin = {
      top: 80,
      right: 20,
      bottom: 30,
      left: 60,
    };
    const height = containerHeight - margin.top - margin.bottom;
    const width = containerWidth - margin.left - margin.right;
    const chart = d3
      .select(this.chartRef)
      .attr("width", containerWidth)
      .attr("height", containerHeight);
    const main = chart
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const xScale = d3
      .scaleUtc()
      .domain([data[0].time, data[data.length - 1].time])
      .range([0, width]);
    const min = d3.min(data, (d: any) => d.value);
    const max = d3.max(data, (d: any) => d.value);
    // @ts-ignore
    const yScale = d3.scaleLinear().domain([0, max]).range([height, 0]);
    const xAxis = d3.axisBottom(xScale).tickFormat(timeFormat);
    const yAxis = d3.axisLeft(yScale);
    const bgLevel = main.append("g").attr("class", "bg-level");
    bgLevel
      .append("g")
      .attr("class", "bg-color")
      .append("rect")
      .attr("width", width)
      .attr("height", (d) => {
        return yScale(150);
      })
      .attr("fill", "#f44c02");
    bgLevel
      .append("g")
      .attr("class", "bg-color")
      .append("rect")
      .attr("width", width)
      .attr("height", (d) => {
        return yScale(100) - yScale(150);
      })
      .attr("y", (d) => yScale(150))
      .attr("fill", "#ff991a");
    bgLevel
      .append("g")
      .attr("class", "bg-color")
      .append("rect")
      .attr("width", width)
      .attr("height", (d) => {
        return yScale(50) - yScale(100);
      })
      .attr("y", (d) => yScale(100))
      .attr("fill", "#ffd433");
    bgLevel
      .append("g")
      .attr("class", "bg-color")
      .append("rect")
      .attr("width", width)
      .attr("height", (d) => {
        return yScale(0) - yScale(50);
      })
      .attr("y", (d) => yScale(50))
      .attr("fill", "#00cc5f");

    bgLevel
      .selectAll(".bg-color")
      .append("text")
      .datum(function () {
        // @ts-ignore
        return this.previousSibling.getBBox();
      })
      .text((d) => {
        if (d.y === 0) return "严重污染";
        if (d.y <= yScale(150) + 1) return "轻度污染";
        if (d.y <= yScale(100) + 1) return "良";
        return "优";
      })
      .attr("fill", "#fff")
      .attr("font-size", "20px")
      .attr(
        "transform",
        (d) => `translate(${d.width / 2},${d.height / 2 + d.y})`
      );

    main
      .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(${0},${height})`)
      .call(xAxis);

    main
      .selectAll(".axis-x .tick")
      .append("line")
      .attr("stroke", "rgba(255,255,255,0.7)")
      .attr("stroke-dasharray", "2,2")
      .attr("shape-rendering", "crispEdges")
      .attr("transform", "translate(" + 0 + "," + -1 * height + ")")
      .attr("y2", height);

    main
      .append("g")
      .call(yAxis)
      .append("text")
      .text("AQI值")
      .attr("dy", "-1rem")
      .attr("fill", "#000");

    const line: any = d3
      .line()
      .curve(d3.curveMonotoneX)
      // @ts-ignore
      .x((d) => xScale(d.time))
      // @ts-ignore
      .y((d) => yScale(d.value));

    let serie = main
      .selectAll(".serie") // 生成线条
      .data([data])
      .enter()
      .append("g")
      .attr("class", "serie");

    serie
      .append("path") // 绘画线条
      .style("stroke", ColorSheet[0])
      .style("stroke-width", 1.5)
      .attr("fill", "none")
      .attr("d", line);

    let label = serie
      .append("g")
      .attr("class", "span")
      .selectAll(".label") // 生成文字包层
      .data((d) => d)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .attr("class", "label")
      .attr("transform", function (d: any, i) {
        return "translate(" + xScale(d.time) + "," + yScale(d.value) + ")";
      });

    label
      .append("text")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .text((d: any) => d.value);

    label
      .insert("rect", "text")
      .datum(function () {
        // @ts-ignore
        return this.nextSibling.getBBox();
      })
      .attr("fill", "rgba(0,0,0,0.5)")
      .attr("rx", "5px")
      .attr("ry", "5px")
      .attr("x", function (d) {
        return d.x - 3;
      })
      .attr("y", function (d) {
        return d.y - 3;
      })
      .attr("width", function (d) {
        return d.width + 2 * 3;
      })
      .attr("height", function (d) {
        return d.height + 2 * 3;
      });

    chart
      .append("g")
      .append("text")
      .attr("fill", "#000")
      .text("XX市昨天PM2.5及空气质量指数(AQI)")
      .attr("font-size", "14px")
      .attr("font-weight", "700")
      .attr("text-anchor", "middle")
      .attr("x", containerWidth / 2)
      .attr("y", 40);
  }
  chartRef: any;
  render() {
    return (
      <div style={{ width: "100%" }}>
        <svg ref={(r) => (this.chartRef = r)}> </svg>{" "}
      </div>
    );
  }
}
