/**
 * Created by Liam Vovk on 2017-09-22.
 */
let baseArray = Array(10).fill(1)
let scaleUp = baseArray.map((val, i) => val + i)
let scaleDown = Object.assign([], scaleUp).reverse()
let numCircles = 500
let circleRadius = 4
let width = '100%'
let height = '100vh'
let colors = [
  "#000080",
  "#0000CD",
  "#0000FF",
  "#0024ff",
  "#393c8c",
  "#360d82",
  "#2f2b72"
]

colors = [
  "#fff",
  "#DFDFDF",
  "#CFCFCF",
  "#B4B4B4",
  "#9B9B9B",
  "#737373",
  "#484848",
  "#242424"
]

let screenWidth = $(window).width()
let screenHeight = $(window).height()

// class nodes {
//   nodes = d3.range(numCircles).map(() => {
//     return {
//       x: 0 + Math.random() * screenWidth,
//       y: screenHeight,
//       radius: Math.random() * 20
//     }
//   })
//   getNodes () {
//     return nodes
//   }
//   removeNode (index) {
//     return nodes.slice(index, 1)
//   }
// }

let nodes = d3.range(numCircles).map(() => {
  return {
    x: 0 + Math.random() * screenWidth,
    y: screenHeight,
    radius: Math.random() * 20
  }
})

let circleId = () => (Math.round(Math.random() * 100000)).toString()

let svg = d3.select(".animation")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

let color = d3.scaleOrdinal(colors)

let newSim = () => {
  return d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-1))
    .force("position", d3.forceY(0).strength(0.002))
    .alphaDecay(0.0001)
}

let newCircle = newNodes => {
  return svg
    .selectAll("circle")
    .data(newNodes)
    .enter()
    .append("circle")
    .attr("r", d => d.radius)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", d => color(d.x))
    .attr("id", circleId())
}

//<path d="M50 0 L75 20 L25 20 Z" />
let newTriangle = newNodes => {
  return svg.selectAll("path")
    .data(newNodes)
    .enter()
    .append("path")
    .attr("d", "M50 0 L75 20 L25 20 Z")
}

let fadeOut = object => {
  svg.selectAll(object)
    .transition()
    .ease(d3.easeLinear)
    .duration(10000)
    .delay(() => 500)
    .attr("r", 0)
    .style("opacity", 0)
}

let deleteSmall = curNodes => {
  let circles = $("circle")
  if (circles.length > 0) {
    let smallCircles = circles.filter(index => {
      let smallCircle = circles[index].r.animVal.value < 2
      smallCircle ? curNodes.splice(index, 1) : false
      return smallCircle
    })
    smallCircles.map(index => $(`#${smallCircles[index].id}`).attr("class", "remove"))
    d3.selectAll("circle.remove").remove()
  }
  return { curNodes: curNodes, numRemoved: smallCircles.length }
}

let startSim = (sim, nodes, node) => {
  return sim.nodes(nodes)
    .on("tick", () => {
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
    })
}

let multipleBallSim = () => {
  let i = 0
  let curNodes = Object.assign([], nodes)
  let animateLoop = () => {
    setInterval(() => {
      let sim = newSim()
      let node = newCircle(curNodes.slice(0,i))
      startSim(sim, [curNodes[i]], node)
      fadeOut("circle")
      i += 1
      i < nodes.length - 100 ? true : clearInterval(animateLoop)
    }, 100)
  }
  animateLoop()
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