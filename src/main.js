var distances = require('./distances');
var app = window.app = {};

app.margin = {top: 30, right: 30, bottom: 30, left: 30};
app.w = 600 - app.margin.left - app.margin.right;
app.h = 600 - app.margin.top - app.margin.bottom;

app.scale = d3.scale.linear()
    .domain([ -1, 12 ])
    .range([0, 300]);

app.chart = d3.select(".chart")
    .attr("width", app.w + app.margin.left + app.margin.right)
    .attr("height", app.h + app.margin.top + app.margin.bottom)
  .append("g")
    .attr("transform", "translate(" + app.margin.left + "," + app.margin.top + ")");

app.chart.append("ellipse")
    .attr("class", "max")
    .attr("cx", app.w / 2)
    .attr("cy", app.h / 2)
    .attr("rx", 0)
    .attr("ry", 0);

app.chart.append("ellipse")
    .attr("class", "current")
    .attr("cx", app.w / 2)
    .attr("cy", app.h / 2)
    .attr("rx", 0)
    .attr("ry", 0);

app.chart.append("ellipse")
    .attr("class", "min")
    .attr("cx", app.w / 2)
    .attr("cy", app.h / 2)
    .attr("rx", 0)
    .attr("ry", 0);

app.chart.append("ellipse")
    .attr("class", "stddev")
    .attr("cx", app.w / 2)
    .attr("cy", app.h / 2)
    .attr("rx", 0)
    .attr("ry", 0);

d3.select('.zoom-range').on('change', function() { 
    update(this.value, Number(d3.select('.lat-range')[0][0].value)); 
});

d3.select('.lat-range').on('change', function() { 
    update(Number(d3.select('.zoom-range')[0][0].value), this.value); 
});

update(0, 0);

function update(z, lat) {
    var min = distances.distances(z, 85);
    var max = distances.distances(z, 0);
    var current = distances.distances(z, lat);
    var stddev = distances.deviations(z);
console.log(stddev);
    app.chart.select("ellipse.max")
        .attr("rx", app.scale(Math.log(max.x)))
        .attr("ry", app.scale(Math.log(max.y)));
    app.chart.select("ellipse.current")
        .attr("rx", app.scale(Math.log(current.x)))
        .attr("ry", app.scale(Math.log(current.y)));
    app.chart.select("ellipse.min")
        .attr("rx", app.scale(Math.log(min.x)))
        .attr("ry", app.scale(Math.log(min.y)));
    app.chart.select("ellipse.stddev")
        .attr("rx", app.scale(Math.log(stddev.x)))
        .attr("ry", app.scale(Math.log(stddev.y)));

    d3.select('#zoom').html(z);
    d3.select('#lat').html(lat);
    d3.select('#x').html(current.x.toFixed(2) + ' m');
    d3.select('#y').html(current.y.toFixed(2) + ' m');
}