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
    var dataset = [ 5, 10, 15, 20, 25 ];
    d3.select(".container").
        selectAll("div").
        data(dataset).
        enter().
        append("div").
        attr('class', 'bar').
        style("height", function(d) {
            return d + "px"
        });
};

Template.locations.events({
    //
});
