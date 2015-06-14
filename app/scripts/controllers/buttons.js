'use strict';

var gButtonsScope = null;

/**
 * @ngdoc function
 * @name angulardemoApp.controller:ButtonsCtrl
 * @description
 * # ButtonsCtrl
 * Controller of the angulardemoApp
 */
angular.module('angulardemoApp').controller('ButtonsCtrl',
       [ '$scope', '$interval', 'pfkFiles',
function ($scope,   $interval,   pfkFiles) {

    $scope.showCurrentMessage = 0;
    $scope.currentMessage = '';

    var msgArea = {
        timerPromise : null,
        displayMessage : function (msg) {
            $scope.currentMessage = msg;
            if (msgArea.timerPromise) {
                $interval.cancel(msgArea.timerPromise);
            }
            $scope.showCurrentMessage = 1;
            msgArea.timerPromise = $interval(function(){
                msgArea.timerPromise = null;
                $scope.showCurrentMessage = 0;
            }, 1000, 1, true);
        }
    };

    // note the choice of making an object.
    // this is because ng-repeat makes a new scope, so when
    // the <input> tries to assign a new value to 'selection',
    // it assigns it in the child scope. but referencing it
    // through the object shares memory with this $scope here,
    // so it modifies this one.

    $scope.radioButton = {
        choices : [
            'First Option',
            'Second Option',
            'Third Option',
            'Fourth Option',
            'Fifth Option',
        ],
        selection : 1,
        onChangeLeft : function () {
            msgArea.displayMessage('thank you for selecting ' +
                                   $scope.radioButton.selection +
                                   ' on the left');
            $scope.rightDemoMenu.setSelection($scope.radioButton.selection);
        }
    }; // $scope.radioButton

    $scope.rightDemoMenu = null;
    $scope.hoverCallback = function(evt,data) {
        switch (evt) {
        case 'CONSTRUCTED':
            $scope.rightDemoMenu = data;
            $scope.rightDemoMenu.setChoices($scope.radioButton.choices);
            $scope.rightDemoMenu.setSelection(1);
            break;
        case 'DESTRUCTED':
            break;
        case 'SELECTION':
            msgArea.displayMessage('thank you for selecting ' +
                                   data.index +
                                   ' on the right');
            $scope.radioButton.selection = data.index;

            switch (data.index) {
            case 0:
            case 1:    
            case 2:
                $scope.switchData.switch0.setOnStuff('OK','green');
                $scope.switchData.switch0.setOffStuff('FREE');
                break;
            case 3:
            case 4:
                $scope.switchData.switch0.setOnStuff('WAIT','red');
                $scope.switchData.switch0.setOffStuff('BUSY');
                break;
            }

            break;
        }
    };

    $scope.do25 = false;

    var tickWidth = 1; //25

    $scope.do25Callback = function(evt,data) {
        switch (evt) {
        case 'CONSTRUCTED':
            data.setState(false);
            $scope.do25 = false;
            break;
        case 'DESTRUCTED':
            break;
        case 'CLICKED':
            if (tickWidth === 25) {
                tickWidth = 1;
            } else {
                tickWidth = 25;
            }
            break;
        }
    };

    $scope.switchData = {};
    $scope.switchCallback = function(evt,data) {
        switch (evt) {
        case 'CONSTRUCTED':
            $scope.switchData[data.id] = data;
            break;
        case 'DESTRUCTED':
            delete $scope.switchData[data.id];
            break;
        case 'ON':
            msgArea.displayMessage(
                'thank you for flipping ' +
                    'the switch ON');
            $scope.ranges.range0.windowMode(3,128);
            $scope.ranges.range1.windowMode(725,128);
            break;
        case 'OFF':
            msgArea.displayMessage(
                'thank you for flipping ' +
                    'the switch OFF');
            $scope.ranges.range0.rangeDragMode(null,null,tickWidth);
            $scope.ranges.range1.rangeDragMode(null,null,tickWidth);
            break;
        }
    };

    $scope.dispTicks = false;
    $scope.dispTicksCallback = function(evt,data) {
        switch (evt) {
        case 'CONSTRUCTED':
            data.setState(false);
            $scope.dispTicks = false;
            break;
        case 'DESTRUCTED':
            break;
        case 'CLICKED':
            $scope.dispTicks = data.newValue;
            if ($scope.dispTicks) {
                if ($scope.radioButton.selection === 1) {
                    $scope.ranges.range0.setTicks([ 16, 29, 55, 116 ], 1);
                } else {
                    $scope.ranges.range0.setTicks([ 1, 77 ], 25);
                }
                $scope.ranges.range1.setTicks([ 750, 755, 770, 800 ], 5);
                if ($scope.radioButton.selection === 3) {
                    $scope.ranges.range0.setHighlightTicks([ 1, 77 ], 25);
                    $scope.ranges.range1.setHighlightTicks(
                        [750, 755, 770, 800], 5);
                }
            } else {
                $scope.ranges.range0.setTicks([]);
                $scope.ranges.range1.setTicks([]);
                $scope.ranges.range0.setHighlightTicks([]);
                $scope.ranges.range1.setHighlightTicks([]);
            }
            break;
        }
    };

    $scope.ranges = {};

    var group1 = [];
    var cnt;
    for (cnt = 900; cnt <= 1000; cnt++) {
        group1.push(cnt);
    }
    for (cnt = 1; cnt <= 124; cnt++) {
        group1.push(cnt);
    }

    var group2 = [];
    for (cnt = 512; cnt <= 830; cnt++) {
        group2.push(cnt);
    }

    $scope.handleRangeEvent = function(evt,data) {
        switch (evt) {
        case 'CONSTRUCTED':
            $scope.ranges[data.id] = data;
            if (data.id === 'range0') {
                data.setValidTicks(group1);
                data.ticks = group1;
            }
            if (data.id === 'range1') {
                data.setValidTicks(group2);
                data.ticks = group2;
            }
            break;
        case 'DESTRUCTED':
            // 
            break;
        case 'WINDOWMOVED':
            msgArea.displayMessage('window moved '+JSON.stringify(data));
            break;
        case 'RANGEDRAGGED':
            msgArea.displayMessage('range dragged '+JSON.stringify(data));

            var startInd = data.startInd;
            var endInd = data.endInd;
            var currentInd = data.startInd;
            var whichRange = data.id;
            var promise = $interval(function() {
                $scope.ranges[whichRange].rangeProgress(
                    $scope.ranges[whichRange].ticks[startInd],
                    $scope.ranges[whichRange].ticks[endInd],
                    $scope.ranges[whichRange].ticks[currentInd],
                    tickWidth
                );
                currentInd ++;
                if (currentInd >= endInd) {
                    $interval.cancel(promise);
                    $scope.ranges[whichRange].rangeDragMode(
                        $scope.ranges[whichRange].ticks[startInd],
                        $scope.ranges[whichRange].ticks[endInd],
                        tickWidth
                    );
                }
            }, 100, 0, true);

            break;
        }
    };

    $scope.modalOpen = false;
    $scope.closeModal = function() {
        $scope.modalOpen = false;
    };

    $scope.fileList = [];

    function FileEntry(file) {
        this.selected = false;
        this.name = file.name;
        this.size = file.size;
        this.stamp = (new Date(file.lastModified)).toUTCString();
        this.file = file;
        this.tristate = null;
    }

    function gotAFile(file) {
        $scope.$apply(function() {
            $scope.fileList.push(new FileEntry(file));
        });
    }

    $scope.uploadButton = function(evt) {
        pfkFiles.getFileFromUser(evt, gotAFile);
    };
    $scope.modalContents = '';
    $scope.displayFront = function() {
        $scope.modalOpen = true;
        $scope.modalContents = '';
        $scope.fileList.forEach(function(file) {
            if (file.selected) {
                pfkFiles.fetchFront(file.file,function(data) {
                    $scope.$apply(function() {
                        $scope.modalContents += 'file: ' + file.name + '\n';
                        $scope.modalContents += data;
                    });
                });
            }
        });
    };
    $scope.downloadButton = function() {
        $scope.fileList.forEach(function(file) {
            if (file.selected) {
                pfkFiles.downloadFileToUser(file.file);
                file.selected = false;
                file.tristate.setState(false);
            }
        });
    };
    $scope.deleteButton = function() {
        // we can't use forEach or every because
        // the list is modified mid-loop.
        for (var ind = 0; ind < $scope.fileList.length; ind++ ) {
            // note that we use 'while' because the array
            // gets shifted down when we splice(x,1), so
            // we have to check the same position again.
            while (ind < $scope.fileList.length &&
                   $scope.fileList[ind].selected) {
                $scope.fileList.splice(ind,1);
            }
        }
    };
    $scope.fileTristateCallback = function(evt,data) {
        var fileEnt = $scope.fileList[parseInt(data.id)];
        switch (evt) {
        case 'CONSTRUCTED':
            fileEnt.tristate = data;
            fileEnt.tristate.setState(fileEnt.selected);
            break;
        case 'DESTRUCTED':
            // anything?
            break;
        case 'CLICKED':
            fileEnt.selected = data.newValue;
            break;
        }
    };

    gButtonsScope = $scope;
    $scope.$on('$destroy',function() {
        gButtonsScope = null;
    });
}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
