'use strict';

var gUtilities = null;

/**
 * @ngdoc service
 * @name testappApp.utilities
 * @description
 * # utilities
 * Service in the testappApp.
 */
angular.module('angulardemoApp').service('utilities',
       [ //'$rootScope',
function (/*$rootScope*/) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var $ = {};

    $.state = {
        urlVars : {},
        windowSizeFuncs : []
    };

    var srch = window.location.search;
    if (srch.length > 2)
    {
        var vars = srch.substr(1).split('&');
        for (var ind in vars) {
            var varval = vars[ind].split('=');
            if (varval.length === 1) {
                $.state.urlVars[varval[0]] = true;
            } else {
                $.state.urlVars[varval[0]] = varval[1];
            }
        }
    }

    $.getView = function () {
        var h = window.location.hash;
        if (h.length <= 2) {
            return '/';
        }
        return h.substr(1);
    };

    $.getUrlVar = function (varName) {
        return $.state.urlVars[varName];
    };

    $.onWindowSize = function (func) {
        for (var ind in $.state.windowSizeFuncs) {
            if ($.state.windowSizeFuncs[ind] === null) {
                $.state.windowSizeFuncs[ind] = func;
                return;
            }
        }
        $.state.windowSizeFuncs.push(func);
    };

    $.offWindowSize = function (func) {
        for (var ind in $.state.windowSizeFuncs) {
            if ($.state.windowSizeFuncs[ind] === func) {
                $.state.windowSizeFuncs[ind] = null;
                return;
            }
        }
    };

    window.onresize = function() {
        for (var ind in $.state.windowSizeFuncs) {
            var func = $.state.windowSizeFuncs[ind];
            if (func) {
                func();
            }
        }
    };

    $.digitToHex = function(val) {
        return '0123456789abcdef'[val];
    };

    $.byteToHex = function(val) {
        var upper = parseInt(val / 16);
        var lower = val % 16;
        return $.digitToHex(upper) + $.digitToHex(lower) + ' ';
    };

    $.uint8ArrayToHex = function(data) {
        var ret = '';
        var count = 0;
        // uint8Array doesn't have many of the Array methods
        for (var ind = 0; ind < data.length; ind++) {
            var item = data[ind];
            ret += $.byteToHex(item);
            if ((count % 4) === 3) {
                ret += ' ';
            }
            if ((count % 8) === 7) {
                ret += ' ';
            }
            if ((count % 16) === 15) {
                ret += '\n';
            }
            count++;
        }
        if ((count % 16) !== 0) {
            ret += '\n';
        }
        return ret;
    };

    gUtilities = $;

    return $;
    
}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
