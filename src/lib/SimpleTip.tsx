import * as d3 from "d3";

export function simpleTip(callHtml: any) {
  let create = function (event: any, d: any) {
    // @ts-ignore
    const tar = this.getBoundingClientRect();
    
    const tip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .html(() => callHtml(d))
    .datum(function () {
      return this;
    })
    .attr("style", (p: any) => {
      return `position: absolute; left: ${
        tar.x + tar.width / 2 - p.offsetWidth / 2
      }px; top: ${
        tar.y - p.offsetHeight - 10
        }px;background-color: rgba(0,0,0,0.5);color: rgba(255,255,255); border-radius: 4px`;
      });
      node.remove = tip.remove.bind(tip);
    };
    let node = {
      create,
      remove: () => {}
    };
  return node;
}
