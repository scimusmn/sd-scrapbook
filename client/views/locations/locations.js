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
     * Southern california focus
     */
    var projection = d3.geo.mercator()
        .scale(13168)
        .center([-119.082, 34.656])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select(".container").append("svg")
        .attr("width", width)
        .attr("height", height);

    /**
     * Load the meteor collection for the Locations
     */
    Deps.autorun(function () {
        var locations = Locations.find().fetch();
        _.each(locations, function(location) {
            console.log('Location', location.longitude + ', ' + location.latitude);

            /**
             * Use D3's projection manipulation to turn the long, lat coordinates into
             * tralation measurements.
             * Transform is a basic SVG attribute, and translate is a type of
             * transformation.
             *
             * Position the circles at the center of the map at first and then
             * move them to their real location with a transition.
             */
            svg.append("circle")
                .attr("transform", function() {
                    return "translate(" + projection([-117.022560, 33.887182]) + ")";
                })
                .transition()
                .attr("r", 30)
                .attr("transform", function() {
                    return "translate(" + projection([location.longitude,location.latitude]) + ")";
                })
                .duration(500);
        });
    });

    //d3.json("/data/arizona.json", function(error, arizona) {
        //svg.append("path")
            //.datum(topojson.feature(arizona, arizona.objects.arizona))
            //.attr("d", path);
    //});

    d3.json("/data/salton.json", function(error, salton) {
        svg.append("path")
            .datum(topojson.feature(salton, salton.objects.salton))
            .attr("d", path);
    });

    d3.json("/data/i15.json", function(error, i15) {
        svg.append("path")
            .datum(topojson.feature(i15, i15.objects.i15))
            .attr("d", path);
    });

    d3.json("/data/states.json", function(error, states) {
        svg.append("path")
            .datum(topojson.feature(states, states.objects.states))
            .attr("d", path);
    });

    d3.json("/data/cities.json", function(error, cities) {
        svg.append("path")
            .datum(topojson.feature(cities, cities.objects.cities))
            .attr("d", path)
            .attr("class", 'cities');
    });

};

Template.locations.events({
    // Respond to events
});
