import * as d3 from "d3";
import React, { Component } from "react";
import { ColorSheet } from "../constants/color";

export default class SimpleArea extends Component {
  data = [
    { day: "2015-01", quantity: 1240 },
    { day: "2015-02", quantity: 1905 },
    { day: "2015-03", quantity: 6232 },
    { day: "2015-04", quantity: 7545 },
    { day: "2015-05", quantity: 543 },
    { day: "2015-06", quantity: 443 },
    { day: "2015-07", quantity: 246 },
    { day: "2015-08", quantity: 5445 },
    { day: "2015-09", quantity: 1154 },
    { day: "2015-10", quantity: 448 },
    { day: "2015-11", quantity: 1545 },
    { day: "2015-12", quantity: 4585 },
    { day: "2016-01", quantity: 1520 },
    { day: "2016-02", quantity: 9015 },
    { day: "2016-03", quantity: 632 },
    { day: "2016-04", quantity: 745 },
    { day: "2016-05", quantity: 343 },
    { day: "2016-06", quantity: 6443 },
    { day: "2016-07", quantity: 546 },
    { day: "2016-08", quantity: 1545 },
    { day: "2016-09", quantity: 1354 },
    { day: "2016-10", quantity: 848 },
    { day: "2016-11", quantity: 2155 },
    { day: "2016-12", quantity: 4585 },
    { day: "2017-01", quantity: 1540 },
    { day: "2017-02", quantity: 905 },
    { day: "2017-03", quantity: 632 },
    { day: "2017-04", quantity: 745 },
    { day: "2017-05", quantity: 3543 },
    { day: "2017-06", quantity: 4443 },
    { day: "2017-07", quantity: 2546 },
    { day: "2017-08", quantity: 545 },
    { day: "2017-09", quantity: 154 },
    { day: "2017-10", quantity: 4848 },
    { day: "2017-11", quantity: 155 },
    { day: "2017-12", quantity: 4585 },
  ];
  componentDidMount(): void {
    const parseDate = d3.timeParse("%Y-%m");
    const data = this.data.map((d) => ({ ...d, day: parseDate(d.day) }));
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 500;
    const margin = { top: 80, right: 40, bottom: 130, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    const margin2 = { top: 410, right: 40, bottom: 60, left: 60 };
    const width2 = containerWidth - margin2.left - margin2.right;
    const height2 = containerHeight - margin2.top - margin2.bottom;
    const chart = d3
      .select(this.chartRef)
      .attr("class", "chart")
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox',  `0 0 ${containerWidth} ${containerHeight}`)

    const xScale = d3
      .scaleTime()
      .range([0, width])
      .domain(d3.extent(data, (d) => d.day) as any);

    const xScale2 = d3.scaleTime().range([0, width2]).domain(xScale.domain());

    const yScale = d3
      .scaleLinear()
      .rangeRound([height, 0])
      .domain([0, d3.max(data, (d) => d.quantity) as any]);
    const yScale2 = d3
      .scaleLinear()
      .range([height2, 0])
      .domain(yScale.domain());

    const yAxis = d3.axisLeft(yScale);
    // @ts-ignore
    const xAxis2 = d3.axisBottom(xScale2).tickFormat(d3.timeFormat("%Y年%m月"));
    const yAxis2 = d3.axisLeft(yScale2);

    const mainAreaPath = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x((d: any) => xScale(d.day))
      .y1((d: any) => yScale(d.quantity))
      .y0(yScale(0));

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.timeFormat("%Y年%m月") as any);

    const main = chart
      .append("g")
      .attr("class", " main")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

      main
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("height", height)
      .attr("width", 0)
      .transition()
      .duration(1000)
      .attr("width", width)

    const axisX = main
      .append("g")
      .attr("class", "axis-x")
      .attr("transform", `translate(${0},${height})`);
    axisX.call(xAxis);

    main
      .append("g")
      .attr("class", "axis-y")
      .call(yAxis)
      .append("text")
      .text("顾客人数(人)")
      .attr("fill", "#000")
      .attr("dy", "-0.75rem");

    const area = main
      .append("path")
      .attr("class", "area")
      .attr("clip-path", "url(#clip)")
      .datum(data)
      .attr("d", mainAreaPath as any)
      .attr("stroke", "none")
      .attr("stroke-width", 1)
      .attr("fill", ColorSheet[0]);

    const mainAreaPath2 = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x((d: any) => xScale2(d.day))
      .y1((d: any) => yScale2(d.quantity))
      .y0(yScale2(0));

    const barControl = chart
      .append("g")
      .attr("class", " barControl")
      .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

    barControl
      .append("g")
      .attr("class", "axis-x-2")
      .attr("transform", `translate(${0},${height2})`)
      .call(xAxis2);
    // barControl.append('g').attr('class', 'axis-y-2').call(yAxis2).attr('transform', `translate(${0},${height2})`)

    barControl
      .append("path")
      .attr("class", "area2")
      .datum(data)
      .attr("d", mainAreaPath2 as any)
      .attr("stroke", "none")
      .attr("stroke-width", 1)
      .attr("fill", ColorSheet[0]);

    const brush = d3
      .brushX() // 设置brush
      .extent([
        [0, 0],
        [width, height2],
      ])
      .on("brush end", brushed);

    const zoom = d3
      .zoom() // 设置zoom
      .scaleExtent([1, Infinity])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", zoomed);

    barControl
      .append("g") // 添加画刷
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, [(width * 2) / 3, width]);

    chart
      .append("rect") // 添加刷放方块
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("cursor", "move")
      .attr("pointer-events", "all")
      .attr("fill", "none")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom as any);

    chart
      .append("g")
      .attr("class", "title")
      .append("text")
      .text("2017年饭店每月接待顾客人数")
      .attr("font-size", "18px")
      .attr("font-weight", "700")
      .attr("x", containerWidth / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle");

    function brushed(event: any) {
      if (event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
      let s = event.selection || xScale2.range();
      xScale.domain(s.map(xScale2.invert, xScale2));
      area.attr("d", mainAreaPath as any);
      axisX.call(xAxis as any);
      // addPointsAndValues()
      // chart
      //   .select(".zoom")
      //   .call(
      //     zoom.transform as any,
      //     d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0)
      //   );
    }

    function zoomed(event: any) {
      if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
      let t = event.transform;

      xScale.domain(t.rescaleX(xScale2).domain());
      area.attr("d", mainAreaPath as any);
      axisX.call(xAxis as any);
      // addPointsAndValues()
      barControl
        .select(".brush")
        .call(brush.move as any, xScale.range().map(t.invertX, t));
    }
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
