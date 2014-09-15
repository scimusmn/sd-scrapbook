/* ---------------------------------------------------- +/

## Locations ##

Code related to the locations template

/+ ---------------------------------------------------- */

Template.locations.created = function () {
    //
};

Template.locations.helpers({
    //
});

Template.locations.rendered = function () {
    /**
     * Arbitrary D3 test code to learn the basics of drawing
     * SVG items on the canvas
     */
    var dataset = [];

    for (var i = 0; i < 25; i++) {           //Loop 25 times
        var newNumber = Math.round(Math.random() * 30);
        dataset.push(newNumber);             //Add new number to array
    }
    var width = 600,
    height = 300;

    /**
     * Projection centered on Arizon, but for some reason Arizona is turned
     * 90 degrees on its side.
     */
    //var projection = d3.geo.albers()
    //.center([-111, 34.2])
    //.rotate([0, 0])
    //.parallels([50, 60])
    //.scale(1200 * 5)
    //.translate([width / 2, height / 2]);

    /**
     * Albers - focused on the continental USA
     */
    //var projection = d3.geo.albersUsa()
    //.scale(1280)
    //.translate([width / 2, height / 2]);

    /**
     * Web mercator focused on the world
     */
    var projection = d3.geo.mercator()
        .scale(1000)
        .center([-111, 34.2])
        .translate([width / 2, height / 2])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select(".container").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("/data/arizona.json", function(error, arizona) {
        svg.append("path")
            .datum(topojson.feature(arizona, arizona.objects.arizona))
            .attr("d", path);
    });
};

Template.locations.events({
    // Respond to events
});
