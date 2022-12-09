import React, { Component } from "react";
import * as d3 from "d3";

export default class SimpleBar extends Component {
  data = [
    { letter: "星期一", frequency: 0.08167 },
    { letter: "星期二", frequency: 0.13492 },
    { letter: "星期三", frequency: 0.02782 },
    { letter: "星期四", frequency: 0.04253 },
    { letter: "星期五", frequency: 0.12702 },
    { letter: "星期六", frequency: 0.02288 },
    { letter: "星期日", frequency: 0.22288 },
  ];
  componentDidMount() {
    const containerWidth = this.chartRef.parentElement.offsetWidth;
    const data = this.data;
    const margin = {
      top: 80,
      right: 20,
      bottom: 30,
      left: 60,
    };
    const width = containerWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    let chart = d3
      .select(this.chartRef)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox',  `0 0 ${containerWidth} ${500}`)

    let x = d3
      .scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(
        data.map(function (d) {
          return d.letter;
        })
      ); // 设置x轴
    let y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        0,
        d3.max(data, function (d) {
          return d.frequency;
        }),
      ]); // 设置y轴

    const barWidth = (width / data.length) * 0.9; // 用于绘制每条柱

    let g = chart
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // 设最外包层在总图上的相对位置

    g.append("g") // 设置x轴
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g") // 设置y轴
      .call(d3.axisLeft(y).ticks(10, "%"))
      .append("text")
      .text("空置率 (%)")
      .attr("dy", "-1em")
      .attr("fill", "#000");

    g.selectAll(".bar") // 画柱图
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", "#597ef7")
      .attr("x", function (d) {
        return x(d.letter);
      })
      .attr("width", x.bandwidth())
      .attr("y", height) // 控制动画由下而上
      .attr("height", 0) // 控制动画由下而上
      .transition()
      .duration(250)
      .attr("y", function (d) {
        return y(d.frequency);
      })
      .attr("height", function (d) {
        return height - y(d.frequency);
      });

    g.append("g") // 输出柱图上的数值
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("fill", "#fff")
      .attr("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("x", function (d, i) {
        return x(d.letter);
      })
      .attr("dx", barWidth / 2)
      .attr("dy", "1em")
      .text(function (d) {
        return (d.frequency * 100).toFixed(2) + "%";
      })
      .attr("y", height) // 控制动画由下而上
      .transition()
      .attr("y", function (d) {
        return y(d.frequency);
      });

    chart
      .append("g") // 输出标题
      .append("text")
      .attr("fill", "#000")
      .attr("font-size", "16px")
      .attr("font-weight", "700")
      .attr("text-anchor", "middle")
      .attr("x", containerWidth / 2)
      .attr("y", 40)
      .text("本周酒店房间空置率");
  }
  chartRef;
  render() {
    return (
      <div style={{ width: "100%" }}>
        <svg ref={(r) => (this.chartRef = r)}> </svg>{" "}
      </div>
    );
  }
}
