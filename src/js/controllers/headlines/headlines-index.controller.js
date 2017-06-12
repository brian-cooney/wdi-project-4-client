angular
  .module('myApp')
  .controller('HeadlinesIndexCtrl', HeadlinesIndexCtrl);

HeadlinesIndexCtrl.$inject = ['HeadlineFactory'];
function HeadlinesIndexCtrl(HeadlineFactory) {
  const vm = this;


//Replace this query with external API call. 

  HeadlineFactory.query()
    .$promise
    .then(res => {
      vm.headlines = res;
    });
}
