angular.module('app').component('logout', {
  controller: ['$firebaseAuthService', '$location', function ($firebaseAuthService, $location) {
    $firebaseAuthService.$unauth();
    $location.path('/login');
  }]
});