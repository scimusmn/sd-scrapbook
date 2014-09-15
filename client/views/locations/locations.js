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

    d3.json("/data/ocean.geojson", function(error, ocean) {
        if (error) return console.error(error);
        console.log(ocean);
        svg.append("path").
            datum(topojson.feature(ocean, ocean.objects.subunits)).
            attr("d", d3.geo.path().projection(d3.geo.mercator()));
    });

    var w = 500;
    var h = 50;
    var svg = d3.select(".container").
        append("svg").
        attr("width", w).
        attr("height", h);

    var circles = svg.selectAll("circle").
        data(dataset).
        enter().
        append("circle");

    circles.
        attr("cx", function(d, i) {
            return (i * 50) + 25;
        }).
        attr("cy", h/2).
        attr("r", function(d) {
            return d;
        });

    d3.select(".container").
        selectAll("div.d3").
        data(dataset).
        enter().
        append("div").
        attr('class', 'bar').
        style("height", function(d) {
            return (d * 5) + "px"
        }).
        text(function(d) {
            return d;
        });
};

Template.locations.events({
    // Respond to events
});
