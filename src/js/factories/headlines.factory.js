angular
  .module('myApp')
  .factory('HeadlineFactory', HeadlineFactory);

HeadlineFactory.$inject = ['API', '$resource'];
function HeadlineFactory(API, $resource){
  return $resource(`${API}/headlines/:id`, { id: '@_id'}, {
    'update': { method: 'PUT' }
  });
}
