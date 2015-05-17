'use strict';

var gStarFieldData = null;

angular.module('angulardemoApp').controller('StarfieldCtrl',
       [ '$scope', '$rootScope', 'utilities',
function ($scope,   $rootScope,   utilities) {

    var data = {
        canvas : angular.element('#starfield-canvas'),
        body : document.body,
        ctx : null,
        starfieldDiv : angular.element('#starfield-div'),
        viewAreaDiv : angular.element('#viewArea'),
        width : null,
        height : null,
        paused : true,
        particleCount : 30000,
        particles : [],
        oldParticles : [],
        imgData : null,
        dataArr : null,
        mouseX : 0,
        mouseY : 0
    };

    var cos = Math.cos;
    var sin = Math.sin;
    var atan2 = Math.atan2;
    var sqrt = Math.sqrt;
    var random = Math.random;

    function loop() {

        var ind, part;
        var x, y, angle, grav, newPos;
        var oldParts = data.oldParticles;
        var parts = data.particles;

        // erase old particles
        for (ind = 0; ind < oldParts.length; ind++) {
            part = oldParts[ind];
            data.dataArr[ part + 0 ] = 0; // red
            data.dataArr[ part + 1 ] = 0; // green
            data.dataArr[ part + 2 ] = 0; // blue
        }

        for (ind = 0; ind < parts.length; ind++) {

            part = parts[ind];

            // calc distance, angle, and grav force from mouse
            x = data.mouseX - part[0];
            y = data.mouseY - part[1];
            angle = atan2(y, x);
            grav = 100 / sqrt( x*x + y*y );

            // update velocity towards mouse
            // proportional to gravitational force
            part[2] += cos(angle) * grav;
            part[3] += sin(angle) * grav;

            // update position
            part[0] += part[2];
            part[1] += part[3];

            // apply drag
            part[2] *= 0.96;
            part[3] *= 0.96;

            // wrap around screen if out of bounds
            while (part[0] >= data.width) {
                part[0] -= data.width;
            }
            while (part[0] < 0) {
                part[0] += data.width - 1;
            }
            while (part[1] >= data.height) {
                part[1] -= data.height;
            }
            while (part[1] < 0) {
                part[1] += data.height - 1;
            }

            // which point in dataArr is this particle's
            // new position.

            newPos =
                (parseInt(part[1]) * data.width * 4) +
                (parseInt(part[0])              * 4);

            data.oldParticles[ ind ] = newPos;

            data.dataArr[ newPos + 0 ] = 255; // red
            data.dataArr[ newPos + 1 ] = 255; // green
            data.dataArr[ newPos + 2 ] = 255; // blue
        }

        data.ctx.putImageData( data.imgData, 0, 0 );

        if (data.paused === false) {
            requestAnimationFrame(loop);
        }
    }

    function handleMouseMove (evt) {
        data.mouseX = evt.offsetX;
        data.mouseY = evt.offsetY;
    }

    function _handleResize () {
        // fetch the client div size
        data.width = data.viewAreaDiv.width() - 100;
        data.height = data.viewAreaDiv.height() - 100;
        // resize the canvas to match

        data.canvas.width(data.width);
        data.canvas.get(0).width = data.width;

        data.canvas.height(data.height);
        data.canvas.get(0).height = data.height;

        // and empty the canvas.
        data.ctx.fillRect(0,0,data.width,data.height);
        data.imgData = data.ctx.getImageData(0,0,data.width,data.height);
        data.dataArr = data.imgData.data;
    }

    data.ctx = data.canvas.get(0).getContext( '2d' );

    function handleResize() {
        $rootScope.$apply(_handleResize);
    }

    utilities.onWindowSize(handleResize);

    data.canvas.on('mousemove', handleMouseMove);
    data.canvas.on('mouseenter', function() {
        data.paused = false;
        loop();
    });
    data.canvas.on('mouseleave', function() {
        data.paused = true;
    });

    gStarFieldData = data;
    $scope.data = data;
    _handleResize();

    // fill the particle array with random particles

    for (var ind = 0; ind < data.particleCount; ind++) {
        data.particles.push([
            random() * data.width,   // x
            random() * data.height,  // y
            0,                            // velocity x
            0                             // velocity y
        ]);
    }
    loop();
    
    $scope.$on('$destroy', function() {
        utilities.offWindowSize(handleResize);
        // make sure animation frame stops
        data.paused = true;
    });

}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
