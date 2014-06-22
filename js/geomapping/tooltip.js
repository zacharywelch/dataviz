(function($) {
  // define width and height of map
  var w = 500
  var h = 300
  
  // define albers usa projection
  var projection = d3.geo.albersUsa()
                     .translate([w/2, h/2])
                     .scale(500)
  
  // tell path to use our defined projection
  var path = d3.geo.path().projection(projection)

  // grab tooltip
  var tooltip = d3.select('#tooltip')
  
  // load TopoJSON data 
  d3.json('/data/geomapping/us.json', function(error, us) {
    d3.select('#map')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .attr('class', 'outline')
      .selectAll('path')
      .data(topojson.feature(us, us.objects.states).features)
      .enter().append('path')
      .attr('d', path)
      .on('mouseover', hovered)
      .on('mousemove', position)
      .on('mouseout', hide)
  });

  // show tooltip with state FIPS code
  function hovered(datum) {
    tooltip.classed('hidden', false)
           .select('val')
           .text(datum.id)
  }

  // reposition tooltip near state
  function position(datum) {
    tooltip.style('top', (event.pageY+25)+'px').style('left',(event.pageX-80)+'px')
  }

  // hide tooltip
  function hide(datum) {
    tooltip.classed('hidden', true)
  }

})(jQuery);

