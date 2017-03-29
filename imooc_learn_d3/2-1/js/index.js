//svg
d3.select('#container')
    .append('svg')
    .attr('width', 500)
    .attr('height', 250);


d3.select('svg')
    .append('g')
    .attr('transform', 'translate(50,30)');