(function($) {
  // define width and height of map
  var w      = 500
  var h      = 300
  var active = d3.select(null)
  var us     = null

  var quantize = d3.scale.quantize()
      .domain([0, .15])
      .range(d3.range(9).map(function(i) { return 'q' + i + '-9'; }));

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

  // grab tooltip
  var tooltip = d3.select('#tooltip')

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
  var g = svg.append('g').attr('id', 'states')

  svg.call(zoom) // enable zoom on mouse and touch
     .call(zoom.event)

  // load TopoJSON data 
  d3.json('/data/geomapping/unemployment.json', function(error, data) {
    us = data
    g.selectAll('path')
     .data(topojson.feature(us, us.objects.states).features)
     .enter()
     .append('path')
     .attr('id', function(d) { return d.id })
     .attr('class', function(d) { return quantize(d.properties.rate); })
     .attr('d', path)
     .on('click', clicked)
     .on('mouseover', hovered)
     .on('mousemove', position)
     .on('mouseout', hide)     
  });

  function clicked(d) {    
    g.selectAll(['#counties']).remove()
    if (active.node() === this) return reset()
    active = d3.select(this)
    
    state_fips = d.id

    // load county TopoJSON data for state
    g.append('g')
     .attr('id', 'counties')
     .selectAll('path')
     .data(topojson.feature(us, us.objects.counties).features.filter(function(d) {
      return state_fips == d.properties.state
     }))
     .enter()
     .append('path')
     .attr('id', function(d) { return d.id })
     .attr('class', function(d) { return quantize(d.properties.rate); })
     .attr('d', path)
     .on('click', function(d) { return reset() })
     .on('mouseover', hovered)
     .on('mousemove', position)
     .on('mouseout', hide)

    // get center of bounding box and scale to 90%
    var bounds = path.bounds(d),
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
    g.selectAll(['#counties']).remove()
    active = d3.select(null) 
    svg.transition()
       .duration(750)
       .call(zoom.translate([0, 0]).scale(1).event)
  }

  // Zoom to state using transition and scale
  function zoomed() {
    g.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')')
     .style('stroke-width', 1 / d3.event.scale + 'px')
  }

  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation()
  }

  // show tooltip with state FIPS code
  function hovered(datum) {
    tooltip.classed('hidden', false)
           .select('h4')
           .text(datum.properties.name)
    tooltip.select('val')
           .text(parseFloat((datum.properties.rate * 100)).toFixed(2) + '%')
  }

  // reposition tooltip near state
  function position(datum) {
    tooltip.style('top', (event.pageY+25)+'px').style('left',(event.pageX-50)+'px')
  }

  // hide tooltip
  function hide(datum) {
    tooltip.classed('hidden', true)
  }
})(jQuery);

