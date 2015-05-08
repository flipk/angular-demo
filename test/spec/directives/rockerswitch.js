'use strict';

describe('Directive: rockerswitch', function () {

  // load the directive's module
  beforeEach(module('testappApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<rockerswitch></rockerswitch>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the rockerswitch directive');
  }));
});
