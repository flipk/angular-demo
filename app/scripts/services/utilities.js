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

    var state = {
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
                state.urlVars[varval[0]] = true;
            } else {
                state.urlVars[varval[0]] = varval[1];
            }
        }
    }

    function getView() {
        var h = window.location.hash;
        if (h.length <= 2) {
            return '/';
        }
        return h.substr(1);
    }

    function getUrlVar(varName) {
        return state.urlVars[varName];
    }

    function onWindowSize(func) {
        for (var ind in state.windowSizeFuncs) {
            if (state.windowSizeFuncs[ind] === null) {
                state.windowSizeFuncs[ind] = func;
                return;
            }
        }
        state.windowSizeFuncs.push(func);
    }

    function offWindowSize(func) {
        for (var ind in state.windowSizeFuncs) {
            if (state.windowSizeFuncs[ind] === func) {
                state.windowSizeFuncs[ind] = null;
                return;
            }
        }
    }

    window.onresize = function() {
        for (var ind in state.windowSizeFuncs) {
            var func = state.windowSizeFuncs[ind];
            if (func) {
                func();
            }
        }
    };

    var ret = {
        state : state,
        getView : getView,
        getUrlVar : getUrlVar,
        onWindowSize : onWindowSize,
        offWindowSize : offWindowSize,
    };

    gUtilities = ret;
    
    return ret;
    
}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
