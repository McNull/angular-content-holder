
var app = angular.module('app', ['ngRoute', 'contentHolder']);

app.controller('AppMainController', function(contentHolder) {
  this.view1 = contentHolder.getView('view1');
  this.view2 = contentHolder.getView('view2');
});

app.controller('AppController1', function() {
  this.myInputValue = 'Ein zwein drein';
  this.mySecondInputValue = 'Lorem del ipsum';
});

app.controller('AppController2', function($scope, contentHolder) {
  this.view1 = contentHolder.getView('view1');
  this.view1.reset();
  
  this.view1.template = '<p>This is the <b>template</b> markup of <i>{{ vm.view1.$id }}</i></p>';
  this.view1.scope = $scope;
});

app.controller('AppController3', function($scope, $location) {
  
  var vm = this;
  var path = $location.path();
  
  vm.links = [
    path + '?param=search',
    path + '?param=arguments',
    path + '?param=should',
    path + '?param=not',
    path + '?param=reset',
    path + '?param=the',
    path + '?param=content',
    path + '?param=views'
  ];
  
  $scope.$watch(function() {
    return $location.search();
  }, function(value) {
    vm.search = value;
  });
  
  vm.createdAt = new Date();
  
});

app.config(function($routeProvider) {
  
  $routeProvider.when('/template/:id', {
   templateUrl: function(args) {
    return 'app/template-' + args.id + '.ng.html';
   },
   reloadOnSearch: false 
  });
  
  $routeProvider.otherwise({
    redirectTo: '/template/1'
  });
});

app.directive('appNavbar', function() {
  return {
    templateUrl: 'app/navbar.ng.html',
    link: function($scope) {
      $scope.navItems = [1, 2, 3];
    }
  };
});

app.controller('AppNavbarController', function(contentHolderConfig) {
  this.config = contentHolderConfig;
});