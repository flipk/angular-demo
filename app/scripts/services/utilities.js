'use strict';

var pfkUtilities = null;

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

    var urlVars = {};

    var srch = window.location.search;
    if (srch.length > 2)
    {
        var vars = srch.substr(1).split('&');
        for (var ind in vars) {
            var varval = vars[ind].split('=');
            if (varval.length === 1) {
                urlVars[varval[0]] = true;
            } else {
                urlVars[varval[0]] = varval[1];
            }
        }
    }

    var ret = {

        getView : function() {
            var h = window.location.hash;
            if (h.length <= 2) {
                return '/';
            }
            return h.substr(1);
        },

        getUrlVar : function(varName) {
            return urlVars[varName];
        }

    };

    pfkUtilities = ret;
    
    return ret;
    
}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
