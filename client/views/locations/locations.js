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
        text(function(d) { return d; });
};

Template.locations.events({
    //
});
