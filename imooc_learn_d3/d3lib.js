/*//曲线图示例
var options = {
	container: '#container',
	margin: {left: 50, top: 30, right: 20, bottom: 20},
	width: 500,
	height: 250,
	data: [1, 3, 5, 7, 8, 4, 3, 7]
};
drawCanvas(options);
drawCurve(options);
drawCurveAxis(options.curve);*/



/*//面积图示例
var options = {
	container: '#container',
	margin: {left: 50, top: 30, right: 20, bottom: 20},
	width: 500,
	height: 250,
	data: [1, 3, 5, 7, 8, 4, 3, 7]
};
drawCanvas(options);
drawArea(options);
drawCurveAxis(options.area);
*/


//柱状图示例
var options = {
	container: '#container',
	margin: {left: 50, top: 30, right: 20, bottom: 20},
	width: 1000,
	height: 500,
	data: [{"year":"1953","population":5.94},{"year":"1964","population":6.95},{"year":"1982","population":10.08},{"year":"1990","population":11.34},{"year":"2000","population":12.66},{"year":"2010","population":13.4}]
};
drawCanvas(options);
drawBar(options);
drawCurveAxis(options.bar);

function drawBar(options) {
	var data = options.data,
	chart_height = options.chart_height,
	chart_width = options.chart_width,
	margin = options.margin;
	var scale_y = d3.scale.linear()
	    .domain([0, d3.max(data, function(d) {
	        return d.population;
	    })])
	    .range([chart_height, 0]);

	var scale_x = d3.scale.ordinal()
	    .domain(data.map(function(d){return d.year;}))
	    .rangeBands([0,chart_width], 0.1);	

	var bar = {
		chart_height: options.chart_height,
	    chart_width: options.chart_width,
		scale_x: scale_x,
		scale_y: scale_y
	};

	var chart = options.svg.append("g")
	    .attr("transform", "translate("+margin.left+","+margin.top+")");

	bar.g = chart;

	options.bar = bar;

	var bars = chart.selectAll(".bar")
	    .data(data)
	    .enter()
	    .append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d, i) {
	        return "translate(" + scale_x(d.year) + ",0)"
	    });

	bars.append("rect")
	    .attr({
	        "y": function(d) {
	            return scale_y(d.population)
	        },
	        "width": scale_x.rangeBand(),
	        "height": function(d) {
	            return chart_height - scale_y(d.population)
	        }
	    })
	    .style("fill", "steelblue");

	bars.append("text")
	    .attr({
	        "y": function(d) {
	        	//加2防止text把柱子占据的高度撑高2px
	            return scale_y(d.population) + 2;
	        },
	        "x": scale_x.rangeBand() / 2,
	        "dy": 15,
	        "text-anchor": "middle"
	    }).text(function(d) {
	    return d.year;
	});
}



function drawArea(options) {
	var data = options.data;

	var area = {
		chart_height: options.chart_height,
	    chart_width: options.chart_width,
		scale_x: d3.scale.linear()
			.domain([0, data.length - 1])
			.range([0, options.chart_width]),
		scale_y: d3.scale.linear()
			.domain([0, d3.max(data)])
			.range([options.chart_height, 0])
	};
	
	var area_generator = d3.svg.area()
	    .x(function(d, i) {
	        return area.scale_x(i);
	    })
	    .y0(options.chart_height)
	    .y1(function(d) {
	        return area.scale_y(d);
	    })
	    .interpolate("cardinal");

    area.g = options.svg
    .append('g')
    .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');

    area.g.append('path')
    .classed('area', true)
    .attr('d', area_generator(options.data));

    options.area = area;
}

function drawCurveAxis(chart) {
	var scale_x = chart.scale_x;
	var scale_y = chart.scale_y;
	// x
	var x_axis = d3.svg.axis().scale(scale_x);
	var y_axis = d3.svg.axis().scale(scale_y).orient("left");

	chart.g.append('g')
	    .call(x_axis)
	    .attr('transform', 'translate(0,' + chart.chart_height + ')');

	// y
	chart.g.append('g')
	    .call(y_axis);
}

//新建画布，并且计算主图的大小
function drawCanvas(options) {
	var width = options.width,
    height = options.height,
    margin = options.margin,
    chart_width = width - margin.left - margin.right,
    chart_height = height - margin.top - margin.bottom;
    options.chart_height = chart_height;
    options.chart_width = chart_width;
	//svg
	options.svg = d3.select(options.container)
	    .append('svg')
	    .attr('width', width)
	    .attr('height', height);
		
}

function drawCurve(options) {
	var data = options.data;

	var curve = {
		chart_height: options.chart_height,
	    chart_width: options.chart_width,
		scale_x: d3.scale.linear()
			.domain([0, data.length - 1])
			.range([0, options.chart_width]),
		scale_y: d3.scale.linear()
			.domain([0, d3.max(data)])
			.range([options.chart_height, 0])
	};
	
	var line_generator = d3.svg.line()
	    .x(function(d, i) {
	        return curve.scale_x(i);
	    })
	    .y(function(d) {
	        return curve.scale_y(d);
	    })
	    .interpolate("cardinal");

    curve.g = options.svg
    .append('g')
    .attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')');

    curve.g.append('path')
    .classed('curve', true)
    .attr('d', line_generator(options.data));

    options.curve = curve;
}

