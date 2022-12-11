import * as d3 from "d3";
import React, { Component } from "react";
import { ColorSheet } from "../constants/color";
import { simpleTip } from "../lib/SimpleTip";

export default class RadialStack extends Component {
  data = [
    { city: "A城市", q1: 3546, q2: 3132, q3: 2299, q4: 1337 },
    { city: "B城市", q1: 199, q2: 275, q3: 275, q4: 299 },
    { city: "C城市", q1: 175, q2: 235, q3: 238, q4: 268 },
    { city: "D城市", q1: 154, q2: 200, q3: 214, q4: 234 },
    { city: "E城市", q1: 123, q2: 127, q3: 168, q4: 139 },
    { city: "F城市", q1: 137, q2: 153, q3: 177, q4: 172 },
    { city: "G城市", q1: 148, q2: 186, q3: 198, q4: 207 },
    { city: "H城市", q1: 155, q2: 200, q3: 214, q4: 234 },
    { city: "I城市", q1: 165, q2: 210, q3: 244, q4: 254 },
    { city: "J城市", q1: 175, q2: 230, q3: 274, q4: 274 },
    { city: "K城市", q1: 185, q2: 250, q3: 304, q4: 294 },
    { city: "L城市", q1: 195, q2: 270, q3: 334, q4: 314 },
    { city: "M城市", q1: 205, q2: 290, q3: 364, q4: 330 },
    { city: "N城市", q1: 546, q2: 988, q3: 1024, q4: 1254 },
    { city: "O城市", q1: 3514, q2: 2541, q3: 1987, q4: 1752 },
    { city: "P城市", q1: 3654, q2: 3787, q3: 3654, q4: 2415 },
    { city: "Q城市", q1: 368, q2: 385, q3: 244, q4: 545 },
    { city: "R城市", q1: 232, q2: 555, q3: 274, q4: 274 },
    { city: "S城市", q1: 358, q2: 344, q3: 304, q4: 787 },
    { city: "T城市", q1: 855, q2: 865, q3: 334, q4: 875 },
    { city: "U城市", q1: 453, q2: 422, q3: 364, q4: 330 },
    { city: "V城市", q1: 568, q2: 478, q3: 875, q4: 254 },
    { city: "W城市", q1: 554, q2: 234, q3: 695, q4: 948 },
    { city: "X城市", q1: 938, q2: 875, q3: 304, q4: 585 },
    { city: "Y城市", q1: 247, q2: 757, q3: 578, q4: 857 },
    { city: "Z城市", q1: 368, q2: 695, q3: 757, q4: 875 },
  ];
  componentDidMount(): void {
    const data = this.data.sort(
      (a, b) => b.q1 + b.q2 + b.q3 + b.q4 - a.q1 - a.q2 - a.q3 - a.q4
    );
    const margin = {
      top: 200,
      right: 60,
      bottom: 80,
      left: 60,
    };
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 1000;
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    const chart = d3
      .select(this.chartRef)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
    const main = chart
      .append("g")
      .attr("width", width)
      .attr("height", height)
      .attr(
        "transform",
        `translate(${containerWidth / 2},${containerHeight / 2})`
      );
    const main1 = chart
      .append("g")
      .attr("width", width)
      .attr("height", height)
      .attr(
        "transform",
        `translate(${containerWidth / 2},${containerHeight / 2})`
      );

    const keys = Object.keys(data[0]).slice(1);

    let series = d3.stack().keys(keys).offset(d3.stackOffsetDiverging)(
      data as any
    );

    const innerRadius = 180;
    const outerRadius = Math.min(width, height) / 2;

    chart
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("circle")
      .attr("r", innerRadius)
      .transition()
      .duration(1000)
      .attr("r", outerRadius);

    let xScale = d3
      .scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(d3.map(data, (d) => d.city));

    const yScale = d3.scaleLinear().range([-1 * innerRadius, -1 * outerRadius]);
    yScale.domain([
      0,
      d3.max(series, (serie) => d3.max(serie, (d) => d[1] as any)),
    ]);

    const yAxis = d3.axisLeft(yScale).ticks(6);
    const y = main1.append("g").attr("class", "yAxis").call(yAxis);
    // .attr("transform", `translate(0, ${(-1 * height) / 2 - 180})`);
    y.select("g").remove();

    let label = main
      .append("g") // 画x轴
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("text-anchor", "middle")
      .attr("transform", (d) => {
        return `rotate(${
          (((xScale(d.city) as any) + xScale.bandwidth() / 2) * 180) / Math.PI -
          90
        }) translate(${innerRadius}, 0)`;
      });

    label.append("line").attr("x2", -5).attr("stroke", "#000");
    label
      .append("text")
      .attr("transform", function (d) {
        return "rotate(90)";
      })
      .attr("dy", 20)
      .attr("font-size", "14px")
      .text(function (d) {
        return d.city;
      });

    main
      .selectAll("circle")
      .data((y.selectAll("g") as any)._groups[0])
      .enter()
      .append("circle")
      .attr("r", (d: any) => -1 * yScale(d.__data__))
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1)
      .attr("fill", "none");

    const tip = simpleTip(
      (d: any) => `
      <p>第一季度: ${d.data.q1}</p>
      <p>第二季度: ${d.data.q2}</p>
      <p>第三季度: ${d.data.q3}</p>
      <p>第四季度: ${d.data.q4}</p>
    `
    );

    main
      .append("g") // 画柱状图
      .selectAll("g")
      .data(series)
      .enter()
      .append("g")
      .attr("clip-path", "url(#clip)")
      .attr("fill", (d, i) => ColorSheet[i])
      .selectAll("path")
      .data(function (d) {
        return d;
      })
      .enter()
      .append("path")
      .on("mouseover", tip.create)
      .on("mouseout", () => tip.remove())
      .attr("cursor", "pointer")
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(function (d: any) {
            return -1 * yScale(d[0]);
          })
          .outerRadius(function (d: any) {
            return -1 * yScale(d[1]);
          })
          .startAngle(function (d: any) {
            return xScale(d.data.city) as any;
          })
          .endAngle(function (d: any) {
            return (xScale(d.data.city) as any) + xScale.bandwidth();
          })
          .padAngle(0.01)
          .padRadius(innerRadius) as any
      );
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
