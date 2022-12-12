import * as d3 from "d3";
import React, { Component } from "react";
import { ColorSheet } from "../constants/color";

export default class SimpleForce extends Component {
  data = {
    nodes: [
      { name: "A人物" },
      { name: "B人物" },
      { name: "C人物" },
      { name: "D人物" },
      { name: "E人物" },
      { name: "F人物" },
      { name: "G人物" },
      { name: "H人物" },
      { name: "I人物" },
      { name: "J人物" },
      { name: "K人物" },
      { name: "L人物" },
      { name: "M人物" },
    ],
    edges: [
      // value越小关系越近
      { source: 0, target: 1, relation: "朋友", value: 3 },
      { source: 0, target: 2, relation: "朋友", value: 3 },
      { source: 0, target: 3, relation: "朋友", value: 6 },
      { source: 1, target: 2, relation: "朋友", value: 6 },
      { source: 1, target: 3, relation: "朋友", value: 7 },
      { source: 2, target: 3, relation: "朋友", value: 7 },
      { source: 0, target: 4, relation: "朋友", value: 3 },
      { source: 0, target: 5, relation: "朋友", value: 3 },
      { source: 4, target: 5, relation: "夫妻", value: 1 },
      { source: 0, target: 6, relation: "兄弟", value: 2 },
      { source: 4, target: 6, relation: "同学", value: 3 },
      { source: 5, target: 6, relation: "同学", value: 3 },
      { source: 4, target: 7, relation: "同学", value: 4 },
      { source: 5, target: 7, relation: "同学", value: 3 },
      { source: 6, target: 7, relation: "同学", value: 3 },
      { source: 4, target: 8, relation: "师生", value: 4 },
      { source: 5, target: 8, relation: "师生", value: 5 },
      { source: 6, target: 8, relation: "师生", value: 3 },
      { source: 7, target: 8, relation: "师生", value: 5 },
      { source: 8, target: 9, relation: "师生", value: 4 },
      { source: 3, target: 9, relation: "师生", value: 5 },
      { source: 2, target: 10, relation: "母子", value: 1 },
      { source: 10, target: 11, relation: "雇佣", value: 6 },
      { source: 10, target: 12, relation: "雇佣", value: 6 },
      { source: 11, target: 12, relation: "同事", value: 7 },
    ],
  };
  componentDidMount(): void {
    const data = this.data;
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const containerHeight = 800;
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
    const simulation = d3
      .forceSimulation() // 构建力导向图
      .nodes(data.nodes as any)
      .force(
        "link",
        d3
          .forceLink(data.edges)
          .id(function (d, i) {
            return i;
          })
          .distance(function (d: any) {
            return d.value * 50;
          })
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    const link = main
      .append("g")
      .attr("class", "links")
      .selectAll("link")
      .data(data.edges)
      .enter()
      .append("line")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1);

    const linkText = main
      .append("g")
      .attr("class", "links")
      .selectAll("linkText")
      .data(data.edges)
      .enter()
      .append("text")
      .text((d) => {
        return d.relation;
      })
      .attr("fill", "#000")
      .attr("opacity", 0);

    const node = main
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr('cursor', 'move')
      .on("mouseenter", function (e, d) {
        linkText.attr("opacity", (dd: any) => {
          if (d.name === dd.source.name || d.name === dd.target.name) return 1;
          return 0;
        });
        link.attr("stroke", (dd: any) => {
          if (d.name === dd.source.name || d.name === dd.target.name)
            return "#000";
          return "#ccc";
        });
        link.attr("stroke-width", (dd: any) => {
          if (d.name === dd.source.name || d.name === dd.target.name) return 2;
          return 1;
        });
      })
      .on("mouseout", function (e, d) {
        linkText.attr("opacity", (dd: any) => {
          return 0;
        });
        link.attr("stroke", "#ccc");
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    node
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d, i) => ColorSheet[i])
      .attr("opacity", 0.6);

    node
      .append("text")
      .text((d) => d.name)
      .attr("fill", "#000")
      .attr("opacity", 0.6)
      .attr("dx", 5)
      .attr("dy", -5);

    function ticked() {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkText
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      node.attr("transform", (d: any) => {
        return `translate(${d.x}, ${d.y})`;
      });
    }

    function dragstarted(e: any, d: any) {
      if (!e.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(e: any, d: any) {
      d.fx = e.x;
      d.fy = e.y;
    }

    function dragended(e: any, d: any) {
      if (!e.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }

  chartRef: any;
  render() {
    return (
      <div style={{ width: "100%" }}>
        <svg ref={(r) => (this.chartRef = r)}></svg>
      </div>
    );
  }
}
