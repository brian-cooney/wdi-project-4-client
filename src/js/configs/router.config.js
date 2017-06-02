angular
.module('Reddit')
.config(Router);


Router.$injection = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];
function Router($stateProvider, $locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/js/views/home.html',
    controller: 'MainCtrl',
    controllerAs: 'main'
  })
  .state('login', {
    url: '/login',
    templateUrl: '/js/views/user/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'Login'
  });

  $urlRouterProvider.otherwise('/');

}
