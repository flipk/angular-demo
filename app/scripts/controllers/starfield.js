'use strict';

var gStarFieldData = null;


angular.module('angulardemoApp').controller('StarfieldCtrl',
       [ '$scope', '$rootScope',
function ($scope,   $rootScope) {

    var data = {
        canvas : document.getElementById('starfield-canvas'),
        body : document.body,
        ctx : null,
        div : document.getElementById('viewArea'),
        width : null,
        height : null,
        oldonresize : null,
        oldonmousemove : null,
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

    function handleResize () {
        // fetch the client div size
        data.width = data.div.clientWidth;
        data.height = data.div.clientHeight;
        // resize the canvas to match
        data.canvas.width = data.width - 10;
        data.canvas.height = data.height - 10;
        // and empty the canvas.
        data.ctx.fillRect(0,0,data.width,data.height);
        data.imgData = data.ctx.getImageData(0,0,data.width,data.height);
        data.dataArr = data.imgData.data;
    }

    if (data.canvas) {
        data.ctx = data.canvas.getContext( '2d' );
    }
    if (data.div) {
        data.width = data.div.clientWidth;
        data.height = data.div.clientHeight;
        data.oldonresize = window.onresize;
        window.onresize = function() {
            $rootScope.$apply(handleResize);
        };
        data.oldonmousemove = data.div.onmousemove;
        data.div.onmousemove = handleMouseMove;
        data.canvas.onmouseenter = function() {
            data.paused = false;
            loop();
        };
        data.canvas.onmouseleave = function() {
            data.paused = true;
        };
    }

    gStarFieldData = data;
    $scope.data = data;
    handleResize();

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
        window.onresize = data.oldonresize;
        data.div.onmousemove = data.oldonmousemove;
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
