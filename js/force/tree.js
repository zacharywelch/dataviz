(function($) {
  var width = 590,
      height = 480

  var svg = d3.select('#viz').append('svg')
      .attr('width', width)
      .attr('height', height);

  var force = d3.layout.force()
      .gravity(.05)
      .distance(100)
      .charge(-375)
      .size([width, height]);

  d3.json('/data/force/tree.json', function(error, json) {
    force
        .nodes(json.nodes)
        .links(json.edges)
        .start();

    var edge = svg.selectAll('.edge')
                  .data(json.edges)
                  .enter()
                  .append('line')
                  .attr('class', 'edge')

    var node = svg.selectAll('.node')
                  .data(json.nodes)
                  .enter()
                  .append('g')
                  .attr('class', 'node')
                  .call(force.drag)

    node.append('image')
        .attr('xlink:href', 'https://github.com/favicon.ico')
        .attr('x', -8)
        .attr('y', -8)
        .attr('width', 16)
        .attr('height', 16)

    node.append('text')
        .attr('dx', 12)
        .attr('dy', '.35em')
        .text(function(d) { return d.name })

    force.on('tick', function() {
      edge.attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; })

      node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
    });
  });
})(jQuery);

