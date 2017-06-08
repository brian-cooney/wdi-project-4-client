angular
  .module('myApp')
  .controller('HeadlinesShowCtrl', HeadlinesShowCtrl);

HeadlinesShowCtrl.$inject = ['HeadlineFactory', '$stateParams'];
function HeadlinesShowCtrl(HeadlineFactory, $stateParams) {
  const vm = this;


//Replace this query with external API call.

  HeadlineFactory.get($stateParams)
    .$promise
    .then(res => {
      vm.headline = res;
    });
}
