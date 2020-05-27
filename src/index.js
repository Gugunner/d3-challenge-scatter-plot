import "./styles.css";
import * as d3 from "d3";
import { dataset } from "../dataset";
import * as _ from "lodash";
document.getElementById("app").innerHTML = `
<div id="chart">

</div>
`;

const chartWidth = 920;
const chartHeight = 630;
const padding = 130;
const sortedDataset = _.sortBy(dataset, ({ Year }) => Year);

const timeParser = d3.timeParse("%M:%S");
const timeFormatter = d3.timeFormat("%M:%S");
const xAxisValues = [
  ..._.map(_.sortBy(_.uniqBy(dataset, "Year"), "Year"), ({ Year }) => Year),
  2016
];

const minDomainYValue = timeParser(d3.min(dataset, ({ Time }) => Time));
const maxDomainYValue = timeParser(d3.max(dataset, ({ Time }) => Time));
console.log(minDomainYValue);

const xScale = d3
  .scaleBand()
  .domain(xAxisValues)
  .range([padding, chartWidth - padding]);

const yScale = d3
  .scaleTime()
  .domain([
    d3.timeSecond.offset(maxDomainYValue, 5),
    d3.timeSecond.offset(minDomainYValue, -5)
  ])
  .range([chartHeight - padding, padding]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3
  .axisLeft(yScale)
  .ticks(10)
  .tickFormat(timeFormatter);

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chartWidth)
  .attr("height", chartHeight)
  .attr("class", "graph")
  .append("g")
  .attr("transform", `translate(60,100)`);

const legend = d3
  .select("#app")
  .select("#chart")
  .attr("position", "absolute")
  .style("width", "950px")
  .insert("div")
  .attr("id", "legend")
  .style("display", "block")
  .style("position", "relative")
  .style("left", `${70}%`)
  .style("top", `-${chartHeight / 2}px`);

legend
  .insert("div")
  .attr("id", "legend-a")
  .style("display", "flex")
  .style("justify-content", "flex-end")
  .style("align-items", "center")
  .insert("p")
  .style("font-weight", "700")
  .style("margin", "5px")
  .text("No doping allegations");
// LegendA Circle
d3.select("#legend-a")
  .insert("div")
  .attr("id", "legend-a-circle")
  .style("width", "15px")
  .style("height", "15px")
  .style("border-radius", "50%")
  .style("background-color", "rgb(255, 127, 14)");

legend
  .insert("div")
  .attr("id", "legend-b")
  .style("display", "flex")
  .style("justify-content", "flex-end")
  .style("align-items", "center")
  .insert("p")
  .style("font-weight", "700")
  .style("margin", "5px")
  .text("Riders with doping allegations");
// LegendB Circle
d3.select("#legend-b")
  .insert("div")
  .attr("id", "legend-a-circle")
  .style("width", "15px")
  .style("height", "15px")
  .style("border-radius", "50%")
  .style("background-color", "rgb(31,119,180)");

svg
  .append("g")
  .attr("id", "x-axis")
  .attr("transform", `translate(0,${chartHeight - padding})`)
  .call(xAxis);

svg
  .append("g")
  .attr("id", "y-axis")
  .attr("transform", `translate(${padding},${0})`)
  .call(yAxis);

const title = svg.append("text");
title
  .attr("id", "title")
  .attr("x", chartHeight / 2 - padding)
  .attr("y", 60)
  .text("Doping in Professional Bycicle Racing");

const subtitle = svg.append("text");
subtitle
  .attr("id", "subtitle")
  .attr("x", chartHeight / 2 - padding / 2)
  .attr("y", 90)
  .text("35 Fastest times up Alpe d'Huez");

const yLabel = svg.append("text");
yLabel
  .attr("id", "y-label")
  .attr("x", -chartHeight / 2)
  .attr("y", padding / 2)
  .text("Time in Minutes")
  .style("transform", "rotate(-90deg)");

svg
  .selectAll("circle")
  .data(sortedDataset)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .style("fill", ({ Doping }) =>
    !Doping ? "rgb(255, 127, 14)" : "rgb(31,119,180)"
  )
  .style("cursor", "pointer")
  .attr("data-xvalue", ({ Year }) => xScale(Year))
  .attr("data-yvalue", ({ Time }) => yScale(timeParser(Time)))
  .attr("cx", ({ Year }) => xScale(Year) + xScale.bandwidth() / 2)
  .attr("cy", ({ Time }) => yScale(timeParser(Time)))
  .attr("r", 5)
  .on("mouseover", ({ Name, Nationality, Year, Time, Place, Doping }) => {
    tooltip
      .attr("data-year", () => xScale(Year))
      .style("display", "block")
      .style("position", "absolute")
      .style("left", () => `${xScale(Year) + xScale.bandwidth() / 2}px`)
      .style("top", () => `${yScale(timeParser(Time))}px`)
      .style("transform", "translate(90px, 90px)")
      .html(
        `<p>${Name} - <span>${Nationality}</span></p>
      <hr>
      <p>Year: ${Year}</p>
      <p>Place: ${Place}</p>
      <p>TIme: ${Time}</p>
      ${Doping === "" ? "" : `<hr><p>${Doping}</p>`}`
      );
  })
  .on("mouseleave", () => tooltip.style("display", "none"));

const tooltip = d3
  .select("#chart")
  .insert("div")
  .attr("id", "tooltip")
  .style("display", "none");
