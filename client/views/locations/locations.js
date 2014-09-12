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
