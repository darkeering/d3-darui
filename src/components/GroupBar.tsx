import * as d3 from "d3";
import * as d3Tip from "d3-tip";
import React, { Component } from "react";
import { ColorSheet } from "../constants/color";

export default class GroupBar extends Component {
  data = [
    { date: "2011", q1: 155, q2: 200, q3: 214, q4: 234 },
    { date: "2012", q1: 165, q2: 210, q3: 244, q4: 254 },
    { date: "2013", q1: 175, q2: 230, q3: 274, q4: 274 },
    { date: "2014", q1: 185, q2: 250, q3: 304, q4: 294 },
    { date: "2015", q1: 195, q2: 270, q3: 334, q4: 314 },
    { date: "2016", q1: 205, q2: 290, q3: 364, q4: null },
  ];
  chartRef: any;
  componentDidMount() {
    const { data } = this;
    const margin = {
      top: 80,
      right: 20,
      bottom: 30,
      left: 60,
    };
    const keys = Object.keys(data[0]).slice(1);
    const max = d3.max(data, (item) => {
      return d3.max(keys, (key) => {
        // @ts-ignore
        return item[key];
      });
    });
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 500;
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    const chart = d3
      .select(this.chartRef)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox',  `0 0 ${containerWidth} ${containerHeight}`)
    const main = chart
      .append("g")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${margin.left},${margin.top})`);
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, width])
      .paddingInner(0.2);
    const x1Scale = d3
      .scaleBand()
      .padding(0.05)
      .domain(keys)
      .rangeRound([0, xScale.bandwidth()]);
    const yScale = d3.scaleLinear().domain([0, max]).range([height, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    main
      .append("g")
      .attr("class", "xAxis")
      .call(xAxis)
      .attr("transform", `translate(${0},${height})`);
    main
      .append("g")
      .attr("class", "yAxis")
      .call(yAxis)
      .append("text")
      .text("营收(万)")
      .attr("fill", "#000")
      .attr("dy", "-0.75rem");

    let tempTip: any;
    let createTip = function () {
      // @ts-ignore
      const tar = d3.select(this);
      // @ts-ignore
      const d = tar._groups[0][0].__data__;

      const tip = main.append("g").attr("class", "tip");
      tip
        .append("text")
        .attr("class", "text")
        .text(d.value)
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        // @ts-ignore
        .attr("x", xScale(d.date) + x1Scale(d.key) + x1Scale.bandwidth() / 2)
        // @ts-ignore
        .attr("dy", yScale(d.value) - 10)
        .attr('opacity', `0`)
        .transition()
        .duration(250)
        .attr('opacity', `1`)

      tip
        .insert("rect", "text")
        .datum(function () {
          // @ts-ignore
          return this.nextSibling.getBBox();
        })
        .attr("fill", "rgba(0,0,0,0.5)")
        .attr("rx", "5px")
        .attr("ry", "5px")
        .attr("x", function (d: any) {
          return d.x - 3;
        })
        .attr("y", function (d: any) {
          return d.y - 3;
        })
        .attr("width", function (d: any) {
          return d.width + 2 * 3;
        })
        .attr("height", function (d: any) {
          return d.height + 2 * 3;
        })
        .attr('opacity', `0`)
        .transition()
        .duration(250)
        .attr('opacity', `1`)
      tempTip = tip;
    };

    const series = main.append("g").attr("class", "series");
    const rect = series
      .selectAll(".series")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "serie")
      .attr("transform", (d) => `translate(${xScale(d.date)},0)`)
      .selectAll(".bar")
      .data((item: any) => {
        return keys.map((key) => ({
          key: key,
          value: item[key],
          date: item.date,
        }));
      })
      .enter()
      .append("g");

    rect
      .append("rect")
      .attr("class", "bar")
      .attr("fill", "#597ef7")
      .attr("width", (d, i) => (i + 1) * 10)
      .attr("fill", (d, i) => ColorSheet[i])
      .attr("x", (d) => x1Scale(d.key) as any)
      .attr("width", x1Scale.bandwidth())
      .on("mouseover", createTip)
      .on("mouseout", function () {
        tempTip.remove();
      })
      .attr("y", height)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => height - yScale(d.value || 0));

    chart
      .append("g")
      .attr("class", "title")
      .append("text")
      .text("XX公司近几年各季度产生营收情况汇总")
      .attr("font-size", "18px")
      .attr("font-weight", "700")
      .attr("x", containerWidth / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle");
  }
  render() {
    return (
      <div style={{ width: "100%" }}>
        <svg ref={(r) => (this.chartRef = r)}> </svg>{" "}
      </div>
    );
  }
}
