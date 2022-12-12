import * as d3 from "d3";
import d3Cloud from "d3-cloud";
import React, { Component } from "react";
import { ColorSheet } from "../constants/color";

export default class SimpletagCloud extends Component {
  data = [
    { name: "腾讯", value: 10, href: "http://www.qq.com/" },
    { name: "阿里巴巴", value: 10, href: "https://www.taobao.com/" },
    { name: "百度", value: 9, href: "https://www.baidu.com/" },
    { name: "京东", value: 8, href: "https://www.jd.com/" },
    { name: "今日头条", value: 7, href: "https://www.toutiao.com/" },
    { name: "网易", value: 8, href: "http://www.163.com/" },
    { name: "新浪", value: 6, href: "http://www.sina.com.cn/" },
    { name: "搜狐", value: 6, href: "http://www.sohu.com/" },
    { name: "美团点评", value: 5, href: "http://www.meituan.com/" },
    { name: "携程", value: 5, href: "http://www.ctrip.com/" },
    { name: "360", value: 7, href: "https://www.360.cn/" },
    { name: "小米", value: 6, href: "https://www.mi.com/" },
    { name: "饿了么", value: 6, href: "https://www.ele.me/" },
    { name: "迅雷", value: 6, href: "http://xunlei.com/" },
    { name: "滴滴", value: 7, href: "http://www.xiaojukeji.com" },
    { name: "摩拜", value: 5, href: "https://mobike.com/cn/" },
    { name: "ofo", value: 6, href: "http://www.ofo.so/" },
  ];
  componentDidMount(): void {
    const data = this.data.map((item) => {
      return {
        text: item.name,
        size: 10 + item.value * 8,
        href: item.href,
      };
    });
    const width = this.chartRef.parentElement.offsetWidth;
    const height = 1000;
    const chart = d3
      .select(this.chartRef)
      .attr("class", "chart")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const main = chart
      .append("g")
      .attr("class", "main")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const layout = d3Cloud()
      .words(data)
      .size([500, 500])
      .padding(5)
      .rotate(function () {
        return ~~(Math.random() * 2) * 90;
      })
      .font("Impact")
      .fontSize((d: any) => d.size)
      .on("end", draw);

    layout.start();

    function draw(words: any) {
      console.log(words);
      main
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-family", "Impact")
        .style("cursor", "pointer")
        .style("fill", (d, i) => ColorSheet[i])
        .attr("text-anchor", "middle")
        .attr("transform", function (d: any) {
          return `translate(${d.x}, ${d.y}) rotate(${d.rotate})`;
        })
        .style("font-size", (d: any) => d.size)
        .text((d: any) => d.text)
        .append("title")
        .text((d: any) => d.text);

      main
        .selectAll("text")
        .attr("opacity", 0)
        .transition()
        .duration(100)
        .delay((d, i) => i * 100)
        .attr("opacity", 1);
    }
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
