import React, { Component } from "react";
import * as d3 from "d3";
import { ColorSheet } from "../constants/color";

export default class SimpleLine extends Component {
  data = [
    { date: "2009", apple: 130, banana: 40 },
    { date: "2010", apple: 137, banana: 58 },
    { date: "2011", apple: 166, banana: 97 },
    { date: "2012", apple: 154, banana: 117 },
    { date: "2013", apple: 179, banana: 98 },
    { date: "2014", apple: 187, banana: 120 },
    { date: "2015", apple: 189, banana: 84 },
    { date: "2016", apple: 210, banana: 53 },
  ];
  series = ["apple", "banana"];
  componentDidMount() {
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 500;
    const data = this.data;
    const margin = {
      top: 80,
      right: 20,
      bottom: 30,
      left: 60,
    };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    let chart = d3
      .select(this.chartRef)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox',  `0 0 ${containerWidth} ${containerHeight}`)

    // 图表主体
    let g = chart
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 设置x轴样式
    let xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map((d) => {
          return d.date;
        })
      );
    // 设置y轴样式
    const max: any = d3.max(data, (d) => d.apple);
    let yScale = d3.scaleLinear().range([height, 0]).domain([0, max]);

    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // 绘制x轴
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // 绘制y轴
    g.append("g")
      .call(yAxis)
      .append("text")
      .text("吨 (t) ")
      .attr("dy", "-1em")
      .attr("fill", "#000");

    this.series.forEach((serie, index) => {
      // 折线路径
      const line: any = d3
        .line()
        .x((d: any) => xScale.bandwidth() / 2 + Number(xScale(d.date)))
        .y((d: any) => yScale(d[serie]));

      // 绘制线条
      g.append("path")
        .attr("fill", "none")
        .attr("d", line(data))
        .attr("stroke", ColorSheet[index])
        .attr("stroke-width", 0)
        .transition()
        .duration(250)
        .attr("stroke-width", 1.5);

      // 绘制节点
      g.append("g")
        .selectAll(".circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", serie)
        .attr("cx", (d: any) => xScale.bandwidth() / 2 + Number(xScale(d.date)))
        .attr("cy", (d: any) => yScale(d[serie]))
        .attr("fill", ColorSheet[index])
        .attr("r", 0)
        .transition()
        .duration(250)
        .attr("r", 4);

      // g.append("g")
      //   .selectAll(".text")
      //   .data(data)
      //   .enter()
      //   .append("text")
      //   .attr("x", (d) => Number(xScale(d.date)))
      //   .attr("dx", xScale.bandwidth() / 2)
      //   .attr("y", (d) => yScale(d.apple))
      //   .attr("fill", "#597ef7")
      //   .text((d) => d.apple)
    });

    // 输出标题
    chart
      .append("g")
      .append("text")
      .attr("fill", "#000")
      .attr("font-size", "16px")
      .attr("font-weight", "700")
      .attr("text-anchor", "middle")
      .attr("x", containerWidth / 2)
      .attr("y", 40)
      .text("最近几年XX本地年产苹果香蕉数量");
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
