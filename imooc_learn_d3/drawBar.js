//柱状图示例
var options = {
    container: '#container',
    margin: {
        left: 100,
        top: 30,
        right: 20,
        bottom: 30
    },
    width: 1000,
    height: 500,
    extremeX: 4, 
    data: [
        ["html", 3],
        ["css", 3],
        ["javascript", 3],
        ["html5", 2],
        ["css3", 2]
    ]
};
drawCanvas(options);
drawBar(options);

function drawBar(options) {
	var data = options.data,
	chart_height = options.chart_height,
	chart_width = options.chart_width,
	margin = options.margin;
	var scale_x = d3.scale.linear()
	    .domain([0, options.extremeX])
	    .range([0, chart_width]);

	var scale_y = d3.scale.ordinal()
	    .domain(data.map(function(d){return d[0];}))
	    .rangeBands([0,chart_height], 0.5);	


	var chart = options.svg.append("g")
	    .attr("transform", "translate("+margin.left+","+margin.top+")");

    //建立格子坐标系
    var x_axis = d3.svg.axis().scale(scale_x).ticks(5)
    .tickFormat(function(d) {
        var arr = ["了解", "熟悉", "熟练", "精通"];
        if(/^[1-4]$/.test(d)) {
            return arr[d-1];
        }
    })
    .tickSize(chart_height, 0).orient("top");
    var y_axis = d3.svg.axis().scale(scale_y)
    .tickSize(chart_width, 0).orient("right");
    chart.append('g')
        .classed('gridx', true)
        .call(x_axis)
        .attr('transform', 'translate(0,' + chart_height + ')')
        .selectAll('.tick text').attr({
            y: 22
        });

    // y
    chart.append('g')
        .classed('gridy', true)
        .call(y_axis).selectAll('.tick text').attr({
            x: -6
        }).style("text-anchor", "end");

    //画图
	var bars = chart.selectAll(".bar")
	    .data(data)
	    .enter()
	    .append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d, i) {
	        return "translate(0," + scale_y(d[0]) + ")"
	    });

    
	bars.append("rect")
	    .attr({
	        "height": scale_y.rangeBand(),
	        "width": 0
	    });

    var rects = $('.bar rect'), step = 1000;
    
    for(var i=0,len=rects.length;i<len;i++) {
        d3.select(rects.eq(i)[0]).transition().delay(i*step).duration(step)
        .attr({
            "width": function(d) {
                return scale_x(d[1])
            }
        });
    }

    
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