(function($) {
  // define width and height of map
  var w      = 500
  var h      = 300
  var active = d3.select(null)

  // define albers usa projection
  var projection = d3.geo.albersUsa()
                     .translate([w/2, h/2])
                     .scale(500)

  // tell path to use our defined projection
  var path = d3.geo.path().projection(projection)

  // define zoom behavior
  var zoom = d3.behavior.zoom()
               .translate([0, 0])
               .scale(1)
               .scaleExtent([1, 8])
               .on('zoom', zoomed)

  // create svg up front
  var svg = d3.select('#map')
              .append('svg')
              .attr('width', w)
              .attr('height', h)
              .attr('class', 'outline')
              .on('click', stopped, true)

  // create overlay that listens to click events
  svg.append('rect')
     .attr('width', w)
     .attr('height', h)
     .attr('class', 'zoom')
     .on('click', reset)

  // group states 
  var g = svg.append('g')

  svg.call(zoom) // enable zoom on mouse and touch
     .call(zoom.event)

  // load TopoJSON data 
  d3.json('/data/geomapping/us.json', function(error, us) {
    g.selectAll('path')
     .data(topojson.feature(us, us.objects.states).features)
     .enter()
     .append('path')
     .attr('d', path)
     .on('click', clicked)
  });

  function clicked(datum) {
    if (active.node() === this) return reset();
    active.classed('active', false);
    active = d3.select(this).classed('active', true);

    // get center of bounding box and scale to 90%
    var bounds = path.bounds(datum),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .9 / Math.max(dx / w, dy / h),
        translate = [w / 2 - scale * x, h / 2 - scale * y]

    // zoom and scale to bounding box
    svg.transition()
       .duration(750)
       .call(zoom.translate(translate).scale(scale).event)
  }

  // Reset scale and zoom on map
  function reset() {
    active.classed('active', false)
    active = d3.select(null) 
    g.style('stroke-width', '1px')
    svg.transition()
       .duration(750)
       .call(zoom.translate([0, 0]).scale(1).event)
  }

  // Zoom to state using transition and scale
  function zoomed() {
    g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')')
     .style('stroke-width', 1.5 / d3.event.scale + 'px')
  }

  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation()
  }

})(jQuery);

