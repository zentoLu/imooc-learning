d3.csv("data.csv", type, function(data) {
    console.log(data);
    var width = 1000,
        height = 500,
        margin = {left: 30, top: 30, right: 10, bottom: 30},
        svg_width = width + margin.left + margin.right,
        svg_height = height + margin.top + margin.bottom;

    var scale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
            return d.population;
        })])
        .range([height, 0]);

    var scale_x = d3.scale.ordinal()
        .domain(data.map(function(d){return d.year;}))
        .rangeBands([0,width], 0.1);

    var svg = d3.select("#container")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

    var chart = svg.append("g")
        .attr("transform", "translate("+margin.left+","+margin.top+")");

    var x_axis = d3.svg.axis().scale(scale_x);
    y_axis = d3.svg.axis().scale(scale).orient("left");
    chart.append("g")
        .call(x_axis)
        .attr("transform", "translate(0,"+height+")");
    chart.append("g")
        .call(y_axis);

    var bar = chart.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
            return "translate(" + scale_x(d.year) + ",0)"
        });

    bar.append("rect")
        .attr({
            "y": function(d) {
                return scale(d.population)
            },
            "width": scale_x.rangeBand(),
            "height": function(d) {
                return height - scale(d.population)
            }
        })
        .style("fill", "steelblue");

    bar.append("text")
        .attr({
            "y": function(d) {
                return scale(d.population);
            },
            "x": scale_x.rangeBand() / 2,
            "dy": 15,
            "text-anchor": "middle"
        }).text(function(d) {
        return d.year;
    });

});

function type(d) {
    d.population = +d.population;
    return d;
}