// Canvas config
const config = {
  width: 800,
  height: 500
};

// Creating the canvas
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", config.width)
  .attr("height", config.height);

// Adding a title
svg
  .append("text")
  .attr("id", "title")
  .attr("font-size", 50)
  .attr("font-family", "Lato")
  .text("Treemap")
  .attr("x", 300)
  .attr("y", 80);

// Fetching data

const kisData =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";
const movieData =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
const gameData =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

Promise.all([d3.json(kisData), d3.json(movieData), d3.json(gameData)]).then(
  data => {
    const kickstarter = data[0];
    const movies = data[1];
    const games = data[2];

    const hierarchy = d3.hierarchy(kickstarter).sum(d => d.value);

    const tree = d3
      .treemap()
      .size([200, 200])
      .paddingOuter(20);

    tree(hierarchy);

    const cell = svg
      .selectAll("g")
      .data(hierarchy.leaves())
      .enter()
      .append("g")
      .attr("class", "big-box")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    const scale = number => number * 8;

    const tile = cell
      .append("rect")
      .attr("width", d => scale(d.x1 - d.x0))
      .attr("height", d => scale(d.y1 - d.y0));
  }
);
