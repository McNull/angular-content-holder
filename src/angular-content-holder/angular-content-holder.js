(function (angular) {

  'use strict';
  
  var ch = angular.module('contentHolder', []);

  ch.constant('contentHolderConfig', {
    resetOnLocationChange: true,
    resetOnSearchChange: false
  });

  ch.factory('contentHolder', function ($rootScope, contentHolderConfig, $location) {

    var views = {};

    function resetView() {
      delete this.template;
      delete this.templateUrl;
      delete this.scope;
    }

    function getView(id) {

      id = id || 'default';

      var view = views[id];

      if (!view) {
        view = views[id] = {
          $id: id, reset: resetView
        };
      }

      return view;
    }

    function resetViews() {
      for (var k in views) {
        var view = views[k];
        view.reset();
      }
    }

    var lastPath = $location.path();
    var lastSearch = $location.search();

    function needsReset() {
      var currentPath = $location.path();
      var currentSearch = $location.search();
      
      var doReset = contentHolderConfig.resetOnLocationChange &&
                    (contentHolderConfig.resetOnSearchChange || lastPath !== currentPath);
      
      lastPath = currentPath;
      lastSearch = currentSearch;
      
      return doReset;
    }
    
    $rootScope.$on('$locationChangeSuccess', function () {
      if(needsReset()) {
        resetViews();
      }
    });

    return {
      getView: getView
    };

  });

  ch.directive('contentView', function (contentHolder, $compile) {

    return {
      scope: true,
      restrict: 'ECA',
      terminal: true,
      priority: 400,
      link: function ($scope, $element, $attrs) {
        var view = $scope.$view = contentHolder.getView($attrs.contentView);
        var lastScope, lastElement;

        $scope.$watch('$view.template', update)
        $scope.$watch('$view.templateUrl', update)
        $scope.$watch('$view.scope', update)

        $scope.$on('$destroy', clean);

        function clean() {
          // console.log('clean', view.$id);
          if (lastScope) {
            lastScope.$destroy();
            lastScope = null;
          }

          if (lastElement) {
            lastElement.remove();
            lastElement = null;
          }
        }

        function update(newValue, oldValue) {
          // console.log('update', view.$id)
          if (newValue === oldValue) {
            return;
          }
          clean();

          var scope = view.scope;

          if (!scope) {
            lastScope = scope = $scope.$new();
          }

          lastElement = angular.element(view.template);

          $compile(lastElement)(scope);
          $element.append(lastElement);

        }

        update(1, 2);

      }
    };

  });

  ch.directive('contentHolder', function (contentHolder) {
    return {
      restrict: 'ECA',
      terminal: true,
      scope: true,
      link: {
        pre: function ($scope, $element, $attrs, $transclude) {

          var view = contentHolder.getView($attrs.contentHolder);
          view.reset();

          view.template = '<div>' + $element.html() + '</div>';
          view.scope = $scope;

          $element.empty();

        }
      }
    };
  });

})(angular);