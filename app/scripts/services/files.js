'use strict';

/**
 * @ngdoc service
 * @name testappApp.utilities
 * @description
 * # utilities
 * Service in the testappApp.
 */
angular.module('angulardemoApp').service('pfkFiles',
       [ '$rootScope', 'utilities',
function ($rootScope,   utilities) {

    var $ = {};

    // this must be called in the context of some
    // widget's click-handler
    $.getFileFromUser = function (evt, gotAFile) {
	if (evt) {
	    console.log('prevent default on',evt);
	    evt.preventDefault();
	    evt.stopPropagation();
	}

	var fileElem = angular.element('<input type="file">');
	fileElem
	    .attr('multiple', 'multiple' )
	// .attr('accept', ? ) list of mime types
	// .attr('capture', ? ) android only, for camera?
	// class? style? id?
//	    .css('visibility','hidden')
//	    .css('position','absolute')
//	    .css('width','1')
//	    .css('height','1')
//	    .css('z-index','-1000')
//	    .css('tabindex','-1')
;

	fileElem.bind('change', function(evt) {
	    $rootScope.$apply(function() {
		if (evt && evt.target && evt.target.files) {
		    for (var ind = 0; ind < evt.target.files.length; ind++) {
			gotAFile(evt.target.files[ind]);
		    }
		}
	    });
	});

	fileElem[0].click();
    };

    $.downloadFileToUser = function (file) {
	console.log('download file',file);

	var blob = file.slice();
	var anchorTag;

	// two ways to do the same thing, one in angular,
	// the other raw
	if (1) {
	    anchorTag = angular.element('<a>');
	    anchorTag.attr('href', window.URL.createObjectURL(blob));
	    anchorTag.attr('download', file.name);
	    anchorTag[0].click();
	} else {
	    anchorTag = document.createElement('a');
	    anchorTag.href = window.URL.createObjectURL(blob);
	    anchorTag.download = file.name;
	    anchorTag.click();
	}
    };

    $.fetchFront = function(file, callbackFn) {
        var fr = new FileReader();
        fr.onloadend = function(evt) {
            $rootScope.$apply(function() {
                callbackFn( 
                    utilities.uint8ArrayToHex(
                        new Uint8Array(evt.target.result)));
            });
        };
        fr.readAsArrayBuffer(file.slice(0,512));
    };

    return $;

}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
