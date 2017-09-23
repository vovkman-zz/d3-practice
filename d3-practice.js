/**
 * Created by Liam Vovk on 2017-09-22.
 */
let baseArray = Array(10).fill(1)
let scaleUp = baseArray.map((val, i) => val + i)
let scaleDown = Object.assign([], scaleUp).reverse()
let numCircles = 100
let width = 1000
let height = 1000
let colors = [
  "#000080",
  "#0000CD",
  "#0000FF",
  "#0024ff",
  "#393c8c",
  "#360d82",
  "#2f2b72"
]
let nodes = d3.range(numCircles).map(() => {
  return {
    x: 0 + Math.random() * 1000,
    y: 1100,
    radius: 12
  }
})

let svg = d3.select(".animation")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

let color = d3.scaleOrdinal(colors)

let simulation = d3.forceSimulation()
  .force("charge", d3.forceManyBody().strength(-1))
  .force("position", d3.forceY(0).strength(0.002))
  .alphaDecay(0.0001)

// let node = svg
//   .selectAll("circle")
//   .data(nodes)
//   .enter()
//   .append("circle")
//   .attr("r", d => d.radius)
//   .attr("cx", d => d.x)
//   .attr("cy", d => d.y)
//   .attr("fill", d => color(d.x))

// simulation.nodes(nodes)
//   .on("tick", () => {
//     node
//       .attr("cx", d => d.x)
//       .attr("cy", d => d.y)
//   })

let newSim = () => {
  return d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-1))
    .force("position", d3.forceY(0).strength(0.002))
    .alphaDecay(0.0001)
}

let newCircle = nodes => {
  return svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", d => d.radius)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", d => color(d.x))
}

let startSim = (sim, nodes, node) => {
  sim.nodes(nodes)
    .on("tick", () => {
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
    })
}

let multipleBallSim = () => {
  let i = 0
  setInterval(() => {
    let sim = newSim()
    let node = newCircle(nodes.slice(0,i))
    startSim(sim, [nodes[i]], node)
    i += 1
  }, 250)
}

multipleBallSim()

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