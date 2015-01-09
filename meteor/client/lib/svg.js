Meteor.svgRecipes = {

    /**
     * Draw traditional looking map pin
     */
    drawPin : function (svg, position) {

        /**
         * Pin Group
         */
        var pinGroup = svg.append('g');

        pinGroup
            .attr('width', '200')
            .attr('height', '200');

        var pinHeadRadius = 5;
        var pinBodyWidth = 2;
        var pinBodyHeight = 15;

        /**
         * Blur filters
         *
         * We make a couple filters of differing blurs
         *
         * We also make the filter bigger to be to prevent clipping
         */
        pinGroup.append('defs')
            .append('filter')
            .attr('id', 'pin-blur-tight')
            .attr('x', '-100')
            .attr('y', '-100')
            .attr('width', '200')
            .attr('height', '200')
            .append('feGaussianBlur')
            .attr('stdDeviation', 2);

        pinGroup.append('defs')
            .append('filter')
            .attr('id', 'pin-blur-loose')
            .attr('x', '-100')
            .attr('y', '-100')
            .attr('width', '200')
            .attr('height', '200')
            .append('feGaussianBlur')
            .attr('stdDeviation', 3);

        /**
         * Map depression
         * Small ellipse shadow where the pin sticks into the map
         */
        pinGroup.append('ellipse')
            .attr('cx', 0)
            .attr('cy', pinBodyHeight + 4)
            .attr('rx', 6.5)
            .attr('ry', 1.5)
            .attr('fill', 'black')
            .attr('filter', 'url(#pin-blur-loose)')
            .attr('opacity', '.8');

        /**
         * Pin Body shadow
         *
         * 45 degree shadow for the pin body
         */
        var pinShadowRot = 140;
        var pinBodyShadowWidth = 2;
        pinGroup.append('rect')
            .attr('x', (0 - (pinBodyShadowWidth / 2)))
            .attr('y', (pinHeadRadius / 2))
            .attr('width', pinBodyShadowWidth)
            .attr('height', 15)
            .attr('fill', 'black')
            .attr('transform', function (){
                var transform = 'rotate(' + pinShadowRot + ', 0, 18)';
                return transform;
            })
            .attr('filter', 'url(#pin-blur-tight)')
            .attr('opacity', '.8');

        /**
         * Pin head shadow
         */
        pinGroup.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', pinHeadRadius - 1)
            .attr('fill', 'black')
            .attr('transform', function (){
                var transform = 'rotate(' + pinShadowRot + ', 0, 18)';
                return transform;
            })
            .attr('opacity', '.4')
            .attr('filter', 'url(#pin-blur-loose)');

        /**
         * Pin body
         *
         * silver gradient rectangle for the body of the pin
         */
        var gradientPinBody = pinGroup.append('svg:defs')
            .append('svg:linearGradient')
            .attr('id', 'gradientPinBody')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%')
            .attr('spreadMethod', 'pad');

        // Light gradient color
        gradientPinBody.append('svg:stop')
            .attr('offset', '0%')
            .attr('stop-color', '#EAECEC')
            .attr('stop-opacity', 1);

        // Dark gradient color
        gradientPinBody.append('svg:stop')
            .attr('offset', '100%')
            .attr('stop-color', '#8E9093')
            .attr('stop-opacity', 1);

        pinGroup.append('rect')
            .attr('x', (0 - (pinBodyWidth / 2)))
            .attr('y', (pinHeadRadius / 2))
            .attr('width', pinBodyWidth)
            .attr('height', pinBodyHeight)
            .attr('fill', 'url(#gradientPinBody)');

        /**
         * Pin head
         *
         * Red radial gradient in a circle for the pin top
         */
        var gradientPinHead = pinGroup.append('svg:defs')
            .append('svg:linearGradient')
            .attr('id', 'gradientPinHead')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%')
            .attr('spreadMethod', 'pad');

        gradientPinHead.append('svg:stop')
            .attr('offset', '0%')
            .attr('stop-color', '#aa0000')
            .attr('stop-opacity', 1);

        gradientPinHead.append('svg:stop')
            .attr('offset', '100%')
            .attr('stop-color', '#3D0000')
            .attr('stop-opacity', 1);

        pinGroup.append('circle')
            //.attr('cx', position[0] + 3.8)
            //.attr('cy', position[1] - 16)
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', pinHeadRadius)
            .attr('fill', 'url(#gradientPinHead)');

        /**
         * Position the pin
         *
         * We transform the entire pin group into the marker location
         */
        pinGroup
            .attr('class', 'pin-group')
            .attr('transform', function (){
                var transform = 'translate(' + (position[0]) + ', ' + ((position[1]) - pinBodyHeight) + ')' +
                    'rotate(' + Meteor.svgRecipes.randPin() + ', 0, 0)';
                return transform;
            });

    },

    /**
     * Randomize the pin rotation
     *
     * Returns a number
     */
    randPin : function () {
        var randPin = _.random(0, 2);
        var pinRotate;
        if (randPin === 0) {
            pinRotate = 0;
        }
        else if (randPin == 1) {
            pinRotate = -5;
        }
        else {
            pinRotate = 5;
        }
        return pinRotate;
    }

};
