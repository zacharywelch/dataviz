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

  // create svg up front
  var svg = d3.select('#map')
              .append('svg')
              .attr('width', w)
              .attr('height', h)
              .attr('class', 'outline')

  // group states 
  var g = svg.append('g')

  // load TopoJSON data 
  d3.json('/data/geomapping/us.json', function(error, us) {
    g.selectAll('path')
     .data(topojson.feature(us, us.objects.states).features)
     .enter()
     .append('path')
     .attr('d', path)

    // overlay data for top 50 cities
    d3.csv('/data/geomapping/us-cities.csv', function(data) {
      svg.selectAll('circle')
         .data(data)
         .enter()
         .append('circle')
         .attr('cx', function(d) {
           return projection([d.lon, d.lat])[0];
         })
         .attr('cy', function(d) {
           return projection([d.lon, d.lat])[1];
         })
         .attr('r', function(d) {
          return Math.sqrt(parseInt(d.population) * 0.00004);
         })
         .attr('class', 'bubble')
    });

  });

})(jQuery);

