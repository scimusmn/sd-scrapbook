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
    var width = 1920,
    height = 1080;

    /**
     * Web mercator focused on Arizona
     */
    var projection = d3.geo.mercator()
        .scale(4000)
        .center([-116.98985, 35.5457])
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

    d3.json("/data/salton.json", function(error, salton) {
        svg.append("path")
            .datum(topojson.feature(salton, salton.objects.salton))
            .attr("d", path);
    });

};

Template.locations.events({
    // Respond to events
});
