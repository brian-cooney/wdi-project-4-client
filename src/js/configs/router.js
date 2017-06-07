angular
.module('myApp')
.config(Router);


Router.$injection = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];
function Router($stateProvider, $locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/js/views/home.html'
  })
  .state('login', {
    url: '/login',
    templateUrl: '/js/views/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'Login'
  })
  .state('register', {
    url: '/register',
    templateUrl: '/js/views/register.html',
    controller: 'RegisterCtrl',
    controllerAs: 'Register'
  })
  .state('headlinesIndex', {
    url: '/headlines',
    templateUrl: '/js/views/headlines/index.html',
    controller: 'HeadlinesIndexCtrl',
    controllerAs: 'headlines'
  });

  $urlRouterProvider.otherwise('/');
}
