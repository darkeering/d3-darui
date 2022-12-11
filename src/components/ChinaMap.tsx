import * as d3 from "d3";
import React, { Component } from "react";
import { ColorSheet } from "../constants/color";

export default class ChinaMap extends Component {
  componentDidMount(): void {
    this.getMapData();
  }

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    this.setMap();
  }

  setMap = () => {
    // @ts-ignore
    if (!this.state.data) return;

    // @ts-ignore
    const data = this.state.data;
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 1000;
    const margin = {
      top: 80,
      right: 20,
      bottom: 30,
      left: 60,
    };

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const chart = d3
      .select(this.chartRef)
      .attr("class", "chart")
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox',  `0 0 ${containerWidth} ${containerHeight}`)
    const main = chart
      .append("g")
      .attr("class", "main")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const projection = d3
      .geoMercator()
      .center([107, 31])
      // @ts-ignore
      .scale(d3.min([width, height]))
      .translate([width / 2, height / 2]);

    let path = d3.geoPath().projection(projection);

    let province = main
      .selectAll("path") // 绘画所有的省
      .data(
        data.features.map((d: any, i: any) => ({ ...d, color: ColorSheet[i] }))
      )
      .enter()
      .append("g");

    province
      .append("path")
      .attr("stroke", "#fff")
      .attr("class", "province")
      .attr("stroke-width", 1)
      .attr("fill", (d: any) => d.color)
      // @ts-ignore
      .attr("d", path)
      .on("mouseover", function (e, d) {
        d3.select(this).attr("fill", "#ffe73d");
      })
      .on("mouseout", function (e, d: any) {
        d3.select(this).attr("fill", d.color);
      });

    province
      .append("text")
      .text((d: any) => d.properties.name)
      .datum(function () {
        // @ts-ignore
        return this.previousSibling.getBBox();
      })
      .attr("x", (d) => d.x + d.width / 2)
      .attr("y", (d) => d.y + d.height / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#ccddee")
      .attr("font-weight", "700");

    chart
      .append("g")
      .attr("class", "title")
      .append("text")
      .text("中国地图")
      .attr("font-size", "18px")
      .attr("font-weight", "700")
      .attr("x", containerWidth / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle");
  };

  getMapData = async () => {
    const res = await fetch("http://cdn.a4z.cn/json/china.geojson");
    const data = await res.json();
    this.setState({ data: data });
  };
  chartRef: any;
  render() {
    return (
      <div style={{ width: "100%" }}>
        <svg ref={(r) => (this.chartRef = r)}> </svg>
      </div>
    );
  }
}
