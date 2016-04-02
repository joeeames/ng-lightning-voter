angular.module('app').factory('routeAuth', function($q, currentUser) {
  return {
    requireAdmin: function() {
      var dfd = $q.defer();
      
      if(currentUser.isAdmin) {
        return dfd.resolve();
      } else {
        return dfd.reject('NOT_AUTHORIZED');
      }
      
      // checkCurrentUserAsync(currentUser, dfd);      
      // return dfd.promise;
    }
  }
  
  // this is an attempt to pause execution until the user data is completely loaded
  // but it's not a for sure thing so it's useless
  /*function checkCurrentUserAsync(currentUser, dfd) {
    setTimeout(function() {
      console.log('deferred current user check', currentUser);
      if(currentUser.isAdmin) {
        return dfd.resolve();
      } else {
        return dfd.reject('NOT_AUTHORIZED');
      }
    }, 0); // it works on a local box if set to 10ms. silly race condition
  }*/
})