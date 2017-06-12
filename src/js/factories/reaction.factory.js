angular
  .module('myApp')
  .factory('ReactionFactory', ReactionFactory);

ReactionFactory.$inject = ['API', '$resource'];
function ReactionFactory(API, $resource){
  return $resource(`${API}/reactions/:id`, { id: '@_id'}, {
    'update': { method: 'PUT' }
  });
}
