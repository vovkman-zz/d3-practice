/**
 * Created by Liam Vovk on 2017-09-22.
 */
let baseArray = Array(10).fill(1)
let scaleUp = baseArray.map((val, i) => val + i)
let scaleDown = Object.assign([], scaleUp).reverse()
let numCircles = 10

// let svgCanvas = d3.select(".animation")
//   .append("svg")
//   .attr("width", "100vw")
//   .attr("height", "100vh")

let animation = () => {
  // svgCanvas.append("circle")
  //   .attr("fill", "steelblue")
  //   .attr("r", 20)
  //   .attr("cx", 50)
  //   .attr("cy", 50)
  d3.forceSimulation(d3.selectAll("circle"))
    .force("collide", d3.forceCollide(40))
}

let scaleUpCircle = () => {
  d3.selectAll("circle")
    .transition()
    .duration(2000)
    .delay((d, i) => i * 50)
    .attr("r", (d, i) => scaleUp[i] * 20)
    .on("end", scaleDownCircle)
}
let scaleDownCircle = () => {
  d3.selectAll("circle")
    .transition()
    .duration(2000)
    .delay((d, i) => i * 50)
    .attr("r", (d, i) => scaleDown[i] * 20)
    .on("end", scaleUpCircle)
}
animation()