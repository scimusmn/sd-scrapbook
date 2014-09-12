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
    var dataset = [ 5, 10, 15, 20, 25 ];
    d3.select(".container").
        selectAll("p").
        data(dataset).
        enter().
        append("p").
        style("color", function(d) {
            if (d > 15) {   //Threshold of 15
                return "red";
            } else {
                return "black";
            }
        }).
        text(function(d) { return d; });
};

Template.locations.events({
    //
});
