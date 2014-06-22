(function($) {
  // define width and height of map
  var w = 500
  var h = 300
  var state

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
     .on('click', state_clicked)

  // group states 
  var g = svg.append('g').attr('id', 'states')

  // load TopoJSON data 
  d3.json('/data/geomapping/us-states.json', function(error, us) {
    g.selectAll('path')
     .data(topojson.feature(us, us.objects.states).features)
     .enter()
     .append('path')
     .attr('id', function(d) { return d.id })
     .attr('d', path)
     .on('click', state_clicked)
  });

  function state_clicked(d) {
    g.selectAll(['#counties']).remove()
    
    if (d && state !== d) {
      // load county TopoJSON data for state
      d3.json('/data/geomapping/ga.json', function(error, ga) {
        g.append('g')
         .attr('id', 'counties')
         .selectAll('path')
         .data(topojson.feature(ga, ga.objects.ga).features)
         .enter()
         .append('path')
         .attr('id', function(d) { return d.id })
         .attr('d', path)
         .on('click', function(d) { return state_clicked(null) })

        state = d
        zoom(state)
      });
    } 
    else {
      state = null
      zoom(state)
    }
  }

  // zoom to center of state or zoom out
  function zoom(d){
    var bounds = getBounds(d)
    var s = (d ? bounds[2] : 1.5)

    g.transition()
     .duration(750)
     .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')scale(' + bounds[2] + ')translate(' + -bounds[0] + ',' + -bounds[1] + ')')
     .style('stroke-width', 1.5 / s + 'px')              
  }

  function getBounds(d) {
    var x, y, z  
    if (d) {
      var centroid = path.centroid(d)
      x = centroid[0]
      y = centroid[1]
      z = 4
    }
    else {
      x = w / 2
      y = h / 2
      z = 1
    }
    return [x, y, z]
  }
})(jQuery);

