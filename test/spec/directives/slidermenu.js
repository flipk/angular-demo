'use strict';

describe('Directive: slidermenu', function () {

  // load the directive's module
  beforeEach(module('testappApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<slidermenu></slidermenu>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the slidermenu directive');
  }));
});
