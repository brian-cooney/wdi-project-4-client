angular
.module('myApp')
.controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['UserFactory', 'CurrentUserService', '$state'];
function LoginCtrl(UserFactory, CurrentUserService, $state) {
  const vm = this;
  vm.login = () => {
    console.log('HIT LOGIN CTRL #1', vm.user);
    UserFactory.login(vm.user)
    .$promise
    .then(user => {
      console.log(user);
      CurrentUserService.getUser();
      $state.go('home');
    }, err => {
      console.log(err, 'error in login controller');
    });
  };
}
