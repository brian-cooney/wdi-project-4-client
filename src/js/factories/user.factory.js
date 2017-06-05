angular
  .module('myApp')
  .factory('UserFactory', UserFactory);

UserFactory.$inject = ['API', '$resource'];
function UserFactory(API, $resource){
  return $resource(`${API}/users/:id`, { id: '@_id'}, {
    'register': { method: 'POST', url: `${API}/register`},
    'login': { method: 'POST', url: `${API}/login`},
    'update': { method: 'PUT' }
  });
}
