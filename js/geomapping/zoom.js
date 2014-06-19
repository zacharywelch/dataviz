(function($) {
  // define width and height of map
  var w = 500
  var h = 300
  var centered

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

  // create overlay that listens to click events
  svg.append('rect')
     .attr('width', w)
     .attr('height', h)
     .attr('class', 'zoom')
     .on('click', clicked)

  // group states 
  var g = svg.append('g')

  d3.json('/data/geomapping/us.json', function(error, us) {
    g.selectAll('path')
     .data(topojson.feature(us, us.objects.states).features)
     .enter()
     .append('path')
     .attr('d', path)
     .on('click', clicked)
  });

  function clicked(datum) {
    var x, y, k;

    if (datum && centered !== datum) {
      var centroid = path.centroid(datum);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = datum;
    } else {
      x = w / 2;
      y = h / 2;
      k = 1;
      centered = null;
    }

    g.selectAll('path')
     .classed('active', centered && function(datum) { return datum === centered; });

    g.transition()
     .duration(750)
     .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
     .style('stroke-width', 1.5 / k + 'px');
  }

})(jQuery);

