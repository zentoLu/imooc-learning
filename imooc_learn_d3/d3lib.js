/*var options = {
	container: '#container',
	margin: {left: 50, top: 30, right: 20, bottom: 20},
	width: 500,
	height: 250,
	data: [1, 3, 5, 7, 8, 4, 3, 7]
};
drawCanvas(options);
drawCurve(options);
drawCurveAxis(options);*/

/*drawCanvas(options);
drawArea(options);
drawCurveAxis(options);*/

var options = {
	container: '#container',
	margin: {left: 50, top: 30, right: 20, bottom: 20},
	width: 1000,
	height: 500,
	data: [{"year":"1953","population":5.94},{"year":"1964","population":6.95},{"year":"1982","population":10.08},{"year":"1990","population":11.34},{"year":"2000","population":12.66},{"year":"2010","population":13.4}]
};
drawBar(options);

function drawBar(options) {
	var width = options.width,
	    height = options.height,
	    margin = options.margin,
	    data = options.data,
	    chart_width = width - margin.left - margin.right,
	    chart_height = height - margin.top - margin.bottom;

	var svg = d3.select(options.container)
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var scale_y = d3.scale.linear()
	    .domain([0, d3.max(data, function(d) {
	        return d.population;
	    })])
	    .range([chart_height, 0]);

	var scale_x = d3.scale.ordinal()
	    .domain(data.map(function(d){return d.year;}))
	    .rangeBands([0,chart_width], 0.1);

	options.area = {
		chart_height: chart_height,
		chart_width: chart_width,
		scale_y: scale_y,
		scale_x: scale_x,
	};
	

	var chart = svg.append("g")
	    .attr("transform", "translate("+margin.left+","+margin.top+")");

	var x_axis = d3.svg.axis().scale(scale_x);
	y_axis = d3.svg.axis().scale(scale_y).orient("left");
	chart.append("g")
	    .call(x_axis)
	    .attr("transform", "translate(0,"+chart_height+")");
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
	            return scale_y(d.population)
	        },
	        "width": scale_x.rangeBand(),
	        "height": function(d) {
	            return chart_height - scale_y(d.population)
	        }
	    })
	    .style("fill", "steelblue");

	bar.append("text")
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
	var area_generator = d3.svg.area()
	    .x(function(d, i) {
        return options.scale_x(i);
	    })
	    .y0(options.svg_height)
	    .y1(function(d) {
	        return options.scale_y(d);
	    })
	    .interpolate("cardinal");

	options.g
	    .append('path')
	    .classed('area', true)
	    .attr('d', area_generator(options.data));
}

function drawCurveAxis(options) {
	var scale_x = options.scale_x;
	var scale_y = options.scale_y;
	// x
	var x_axis = d3.svg.axis().scale(scale_x);
	var y_axis = d3.svg.axis().scale(scale_y).orient("left");

	options.g.append('g')
	    .call(x_axis)
	    .attr('transform', 'translate(0,' + options.svg_height + ')');

	// y

	options.g.append('g')
	    .call(y_axis);
}

//新建画布，并且确定伸缩函数
function drawCanvas(options) {
		var width = options.width,
	    height = options.height,
	    margin = options.margin,
	    svg_width = width - margin.left - margin.right,
	    svg_height = height - margin.top - margin.bottom;
	    options.svg_height = svg_height;
	    options.svg_width = svg_width;
		//svg
		d3.select(options.container)
		    .append('svg')
		    .attr('width', width)
		    .attr('height', height);

		options.g = d3.select('svg')
		    .append('g')
		    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		var data = options.data;

		options.scale_x = d3.scale.linear()
		    .domain([0, data.length - 1])
		    .range([0, svg_width]);

		options.scale_y = d3.scale.linear()
		    .domain([0, d3.max(data)])
		    .range([svg_height, 0]);
}

function drawCurve(options) {
	var line_generator = d3.svg.line()
	    .x(function(d, i) {
	        return options.scale_x(i);
	    })
	    .y(function(d) {
	        return options.scale_y(d);
	    })
	    .interpolate("cardinal");

	options.g
	    .append('path')
	    .classed('curve', true)
	    .attr('d', line_generator(options.data));
}

