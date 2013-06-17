var map = function () {

  var config = {
    width:960,
    height:540,
    topology:null
  };


  var map = function (selection) {
    var topology = config.topology;

    var projection = d3.geo.albers()
      .center([2, 55.4])
      .rotate([4.4, 0])
      .parallels([50, 60])
      .scale(1160 * 5)
      .translate([config.width / 2, config.height / 2]);

    var path = d3.geo.path()
      .projection(projection);

    var svg = selection.append("svg")
      .attr("width", config.width)
      .attr("height", config.height);

    d3.entries(topology.objects).forEach(function (entry) {
      var featureName = entry.key;
      var feature = topojson.feature(topology, entry.value);

      svg.selectAll(".region." + featureName)
        .data(feature.features)
        .enter().append("path")
        .attr("class", function (d) {
          return ["region", featureName, className(d.properties.name)].join(' ');
        })
        .attr("d", path)
        .on('mouseover', function (d) {
          d3.select('.selected').classed('selected', false);
          d3.select(this).classed('selected', true);

          var text = label.select('.label text')
            .attr('x', labelPosition(svg.select(classSelector(className(d.properties.name))).node()).x)
            .attr('y', labelPosition(svg.select(classSelector(className(d.properties.name))).node()).y)
            .text(d.properties.name);
          var textDimensions = text.node().getBBox();
          label.select('.label rect')
            .attr('x', textDimensions.x - 2)
            .attr('y', textDimensions.y - 2)
            .attr('width', textDimensions.width + 4)
            .attr('height', textDimensions.height + 4)
            .attr('rx', 4);
        });

      var label = svg.append('g').classed('label', true);
      label.append('rect');
      label.append('text');
    });
  };


  var labelPosition = function (node) {
    var box = node.getBBox();
    return {
      x:Math.max(box.x + box.width * 0.8, box.x + box.width * 0.5 + 10),
      y:box.y + box.height * 0.5
    };
  }

  var args = function () {
    return Array.prototype.slice.call(arguments.callee.caller.arguments);
  }

  /* classSelector(name [, name...]) */
  var classSelector = function () {
    return args().map(function (n) {
      return '.' + n;
    }).join('');
  }

  var className = function (string) {
    return string.replace(/\W+/g, '_');
  }

  var configurable = function (f, config) {
    d3.keys(config).forEach(function (property) {
      f[property] = function (value) {
        if (!arguments.length) return config[property];
        config[property] = value;
        return f;
      };
    });

    return f;
  }


  return configurable(map, config);
}
