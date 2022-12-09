import React, { Component } from "react";
import * as d3 from "d3";
import { ColorSheet } from "../constants/color";

export default class SimplePie extends Component {
  data = [
    { age: "<5", population: 2704659 },
    { age: "5-13", population: 4499890 },
    { age: "14-17", population: 2159981 },
    { age: "18-24", population: 3853788 },
    { age: "25-44", population: 14106543 },
    { age: "45-64", population: 8819342 },
    { age: "≥65", population: 1612463 },
  ];
  componentDidMount(): void {
    const data = this.data;
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 500;
    const margin = {
      top: 80,
      right: 60,
      bottom: 80,
      left: 60,
    };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const radius = Math.min(width, height) / 2;

    const chart = d3
      .select(this.chartRef)
      .attr("class", "chart")
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox',  `0 0 ${containerWidth} ${containerHeight}`)

    const main = chart
      .append("g")
      .attr("class", "main")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left}, ${margin.top + radius})`
      );

    const pie = d3.pie().value((d: any) => d.population);
    const piedata = pie(data as any);
    console.log(piedata);

    const outerRadius = radius;
    const innerRadius = 0;
    const arc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);
    const arc2 = d3
      .arc()
      .outerRadius(outerRadius + 20)
      .innerRadius(innerRadius);
    const arc3 = d3
      .arc()
      .outerRadius(outerRadius + 10)
      .innerRadius(outerRadius + 10);
    // const colors = d3.schemeCategory10;
    // const arcs = chart.select('.pie-container').data(piedata).enter().append('path').attr('class', 'pie').attr('d', (d: any) => arc(d)).attr('fill', (d, i) => colors[i])
    main
      .selectAll(".pie-container")
      .data(piedata)
      .enter()
      .append("path")
      .attr("d", arc as any)
      .each(function(d) {
        let tem = { ...d, endAngle: d.startAngle };
        (this as any)['_currentData'] = tem
      })
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("d", arc2 as any);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("d", arc as any);
      })
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("fill", (d, i) => ColorSheet[i])
      .transition()
      .duration(1000)
      .attrTween('d', function(next) {
        // 动态设置d属性、生成动画
        var i = d3.interpolate((this as any)['_currentData'], next);
        (this as any)['_currentData'] = i(0) // 重设当前角度
        return function(t) {
          return arc(i(t) as any) as any
        }
      })


    const midAngle = (d: any) => d.startAngle + (d.endAngle - d.startAngle) / 2;
    main
      .selectAll(".line")
      .data(piedata)
      .enter()
      .append("polyline")
      .attr("stroke", "#000")
      .attr("stroke-width", "1")
      .attr("fill", "none")
      .attr("points", function (d) {
        arc.centroid(d as any);
        const pos = arc3.centroid(d as any);
        pos[0] = outerRadius * 1.4 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d as any), arc3.centroid(d as any), pos] as any;
      });
    main
      .selectAll(".text")
      .data(piedata)
      .enter()
      .append("text")
      .text((d: any) => d.data.age)
      .attr('dy', '0.3rem')
      .attr('fill', '#000')
      .attr("transform", function (d) {
        arc.centroid(d as any);
        const pos = arc3.centroid(d as any);
        pos[0] = outerRadius * 1.5 * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('text-anchor', function(d) {
        arc.centroid(d as any);
        const pos = arc3.centroid(d as any);
        pos[0] = outerRadius * 1.5 * (midAngle(d) < Math.PI ? 1 : -1);
        return midAngle(d) < Math.PI ? 'start' : 'end';
      })
      chart
      .append("g") // 输出标题
      .attr("class", "arc--title")
      .append("text")
      .attr("fill", "#fff")
      .attr("font-size", "14px")
      .attr("font-weight", "700")
      .attr(
        "transform",
        `translate(${width / 2 + margin.left}, ${margin.top + radius})`
      )
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 0)
      .text("XX市人口年龄结构");
  }
  chartRef: any;
  render() {
    return (
      <div style={{ width: "100%" }}>
        <svg ref={(r) => (this.chartRef = r)}> </svg>
      </div>
    );
  }
}
