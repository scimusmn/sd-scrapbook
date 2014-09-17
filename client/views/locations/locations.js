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
        _.each(locations, function(location, i) {
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
            position = projection([location.longitude,location.latitude]);

            /**
             * Draw a white background first
             *
             * This serves as the matte for a shadow and also gives us a old
             * skoool white border around the photo.
             */
            svg.append('rect')
                .attr("transform", function() {
                    return "translate(" + projection([location.longitude,location.latitude]) + ")";
                })
                .attr("width", 300)
                .attr("height", 250)
                .attr('stroke', 'white')
                .attr('stroke-width', '10')
                .attr('class', 'location-matte');

            clipId = 'special-' + i;
            console.log(clipId);
            svg.append('clipPath')
                .attr("id", clipId)
                    /**
                     * Clip with a circle that bounces in from its center
                     */
                    //.append('circle')
                    //.attr("transform", function() {
                        //return "translate(" + projection([location.longitude,location.latitude]) + ")";
                    //})
                    //.attr("r", .01)
                    //.transition()
                    //.attr("r", 90)
                    //.duration(300)
                    //.delay(i * 200) // Stagger the markers animating in
                    //.transition()
                    //.attr("r", 40)
                    //.duration(100)
                    //.transition()
                    //.attr("r", 80)
                    //.duration(80)

                    /**
                     * Clip the image with a rectangle
                     */
                    .append('rect')
                    .attr("transform", function() {
                        return "translate(" + projection([location.longitude,location.latitude]) + ")";
                    })
                    .attr("width", 300)
                    .attr("height", 250)

                    //.attr('clip-path', clipIdUrl)
                    //.attr("transform", function() {
                        //return "translate(" + projection([location.longitude,location.latitude]) + ")";
                    //})
                    //.attr("r", 40);

            clipIdUrl = 'url(#' + clipId + ')';
            console.log(clipIdUrl);
            svg.append('image')
                .attr("xlink:href", "/images/house.jpg")
                .attr("width", "600")
                .attr("height", "400")
                .attr("x", (position[0]-100))
                .attr("y", (position[1]-100))
                .attr("clip-path", clipIdUrl);

            /**
             * Finally draw a placename
             */
            svg.append('svg:text')
                .attr("x", position[0])
                .attr("y", position[1])
                .attr("class", 'location-title')
                .text(location.title);

            /**
             * Reference dot to show where the location lat long is pointing
             *
             * This should be turned off in the final version.
             */
            svg.append('circle')
                .attr("r", 10)
                .attr("transform", function() {
                    return "translate(" + projection([location.longitude,location.latitude]) + ")";
                })
                .attr("class", 'location-ref-marker')


            //svg.append("svg:image")
                //.attr("xlink:href", "/images/house.jpg")
                //.attr("x", position[0])
                //.attr("y", position[1])
                //.attr("width", "200")
                //.attr("height", "182")
                //.transition()
                //.attr("width", "400")
                //.attr("height", "282")
                //.duration(800);
        });
    });

    /**
     * Test map data to position the map projection
     *
     * These don't need to be shown in the final map, but keep them here.
     * If the background raster map changes, we will need this data to
     * reproject the D3 map so that the location markers are correct.
     */
    //d3.json("/data/salton.json", function(error, salton) {
        //svg.append("path")
            //.datum(topojson.feature(salton, salton.objects.salton))
            //.attr("d", path);
    //});

    //d3.json("/data/i15.json", function(error, i15) {
        //svg.append("path")
            //.datum(topojson.feature(i15, i15.objects.i15))
            //.attr("d", path);
    //});

    //d3.json("/data/states.json", function(error, states) {
        //svg.append("path")
            //.datum(topojson.feature(states, states.objects.states))
            //.attr("d", path);
    //});

    //d3.json("/data/cities.json", function(error, cities) {
        //svg.append("path")
            //.datum(topojson.feature(cities, cities.objects.cities))
            //.attr("d", path)
            //.attr("class", 'cities');
    //});

};

Template.locations.events({
    // Respond to events
});
