angular.module('app').config(['$firebaseRefProvider', function ($firebaseRefProvider) {
  $firebaseRefProvider.registerUrl('http://ng-lightning-voter.firebaseio.com');
}]);