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
const padding = 60;
const sortedDataset = _.sortBy(dataset, d => d["Year"]);

const minDomainXValue = d3.min(sortedDataset, d => d["Year"]);
const maxDomainXValue = d3.max(sortedDataset, d => d["Year"] + 1);
const minDomainYValue = d3.min(sortedDataset, d =>
  Number(d["Time"].replace(/:/gi, "."))
);
const maxDomainYValue = d3.max(sortedDataset, d =>
  Number(d["Time"].replace(/:/gi, "."))
);

const xScale = d3
  .scaleLinear()
  .domain([minDomainXValue, maxDomainXValue])
  .range([padding, chartWidth - padding]);

const yScale = d3
  .scaleLinear()
  .domain([maxDomainYValue, minDomainYValue])
  .range([chartHeight - padding, padding]);

console.log("Min Domain X Value", minDomainXValue);
console.log("Max Domain X Value", maxDomainXValue);
console.log("Min Domain Y Value", minDomainYValue);
console.log("Max Domain Y Value", maxDomainYValue);

console.log("Max XScale", xScale(maxDomainXValue));
console.log("Min XScale", xScale(minDomainXValue));
console.log("Max YScale", yScale(maxDomainYValue));
console.log("Min YScale", yScale(minDomainYValue));

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chartWidth + padding)
  .attr("height", chartHeight);

const title = svg.append("text");
title
  .attr("id", "title")
  .attr("x", chartHeight / 4)
  .attr("y", padding + 10)
  .text("Doping in Professional Bycicle Racing");

let minute = -1;
let seconds = 0;
const timeSpecifier = "%M:%S";
const yLabels = _.map(
  _.map(_.fill(Array(12), 37), (time, idx) => {
    seconds += 15;
    if (idx === 0 || seconds === 60) {
      minute++;
      seconds = 0;
    }
    const stringSeconds = `${seconds === 0 ? "00" : seconds}`;
    return `${time + minute}:${stringSeconds}`;
  }),
  time => d3.timeParse(timeSpecifier)(time)
);
console.log("Y Labels", yLabels);

const xAxis = d3.axisBottom(xScale);
const timeScale = d3
  .scaleTime()
  .domain(_.reverse(d3.extent(yLabels)))
  .nice()
  .range([chartHeight - padding, padding]);

const yAxis = d3.axisLeft(timeScale);

svg
  .selectAll("circle")
  .data(dataset)
  .append("circle");

svg
  .append("g")
  .attr("id", "x-axis")
  .attr("transform", `translate(0,${chartHeight - padding})`)
  .call(xAxis.tickFormat(d => d));

svg
  .append("g")
  .attr("id", "y-axis")
  .attr("transform", `translate(${padding},${0})`)
  .call(
    yAxis.tickValues(yLabels).tickFormat(d => d3.timeFormat(timeSpecifier)(d))
  );
