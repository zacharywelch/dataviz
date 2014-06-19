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
  
  // load TopoJSON data 
  d3.json('/data/geomapping/us.json', function(error, us) {
    d3.select('#map')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .attr('class', 'outline')
      .append('path')
      .datum(topojson.feature(us, us.objects.counties))
      .attr('d', path)
  });
})(jQuery);

