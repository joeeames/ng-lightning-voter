angular.module('app').factory('fbRef', function($firebaseRef, $firebaseAuthService) {
  return {
    getUsersRef: function() {
      return $firebaseRef.default.child('users');
    },
    getUserSessionsRef: function() {
      return $firebaseRef.default.child('userSessions')
        .child($firebaseAuthService.$getAuth().uid);
    },
    getReviewedSessionsRef: function() {
      return $firebaseRef.default.child('reviewedSessions')
        .child($firebaseAuthService.$getAuth().uid);
    },
    getSessionsRef: function() {
      return $firebaseRef.default.child('sessions');
    }
  }
})