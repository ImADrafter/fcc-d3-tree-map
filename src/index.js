// Canvas config
const config = {
  width: 1000,
  height: 1200
};

// Creating the canvas
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", config.width)
  .attr("height", config.height);

// Color scale
const colorScale = d3.scaleOrdinal(d3.schemeDark2);

// Position for header
headerPosition = {
  width: 200,
  height: 50
};

//Title container
const titleContainer = svg.append("g");

// Adding a title
const title = titleContainer
  .append("text")
  .attr("id", "title")
  .attr("font-size", 50)
  .attr("font-family", "Lato")
  .text("Treemap")
  .attr("x", headerPosition.width)
  .attr("y", headerPosition.height);

// Define a tooltip

const tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("position", "absolute")
  .style("display", "none");

// Fetching data
const kisData =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";
const movieData =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
const gameData =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

Promise.all([d3.json(kisData), d3.json(movieData), d3.json(gameData)]).then(
  data => {
    const list = ["kickstarter", "movies", "games"];

    const selector = titleContainer
      .append("text")
      .attr("id", "description")
      .attr("x", (d, i) => headerPosition.width + 20)
      .selectAll("tspan")
      .data(list)
      .enter()
      .append("tspan")
      .attr("y", (d, i) => headerPosition.height + 20)
      .text(d => d + " ")
      .attr("cursor", "pointer")
      .on("click", (d, i) => {
        d3.selectAll("graph").remove();
        d3.select("#legend").remove();
        d3.select(".tspan-text").remove();
        drawMap(i);
      });

    const tree = d3.treemap().size([config.width - 20, config.height]);

    const drawMap = i => {
      const hierarchy = d3.hierarchy(data[i]).sum(d => d.value);

      tree(hierarchy);

      const categories = hierarchy.leaves().map(nodes => nodes.data.category);

      const reducedCategories = [...new Set(categories)];

      console.log(reducedCategories);

      const cell = svg
        // .selectAll(".graph")
        .selectAll(".graph")
        .data(hierarchy.leaves())
        .enter()
        .append("g")
        .attr("class", "big-box")
        .attr("transform", d => `translate(${d.x0},${d.y0 + 80})`)
        .on("mouseover", (d, i) => {
          tooltip
            .style("display", "block")
            .style("background-color", "rgba(255,255,255,0.7)")
            .style("padding", "10px")
            .style("border-radius", "5px")
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY - 28 + "px")
            .attr("data-value", d.value)
            .append("text")
            .text(`Value: ${d.value}`);
        })
        .on("mouseout", (d, i) => {
          tooltip.style("display", "none").text("");
        });

      const tile = cell
        .append("rect")
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.parent.data.name))
        .attr("stroke", "rgba(255,255,255,0.5")
        .attr("stroke-width", "1");

      cell
        .append("text")
        .attr("class", "tile-text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append("tspan")
        .attr("class", "tspan-text")
        .style("font-size", 10)
        .attr("x", 4)
        .attr("font-family", "Lato")
        .attr("y", (d, i) => 13 + i * 10)
        .text(d => d);

      const colorLegend = svg
        .append("g")
        .attr("id", "legend")
        .selectAll("rect")
        .data(reducedCategories)
        .enter()
        .append("g")
        .attr("class", "legend-container")
        .append("rect")
        .attr("class", "legend-item")
        .attr("x", (d, i) => 500 + i * 30)
        .attr("fill", i => colorScale(i))
        .attr("width", 20)
        .attr("height", 50);

      d3.selectAll(".legend-container")
        .append("text")
        .attr("class", "legend-text")
        .text((d, i) => reducedCategories[i])
        .attr("x", (d, i) => 5)
        .attr("y", (d, i) => -500 - i * 30 - 5)
        .attr("transform", "rotate(90)");
    };

    drawMap(0);
  }
);
