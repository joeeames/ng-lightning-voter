angular.module('app').component('nav', {
  templateUrl: '/nav/nav.html',
  bindings: {
    sessions: '=',
    reviewedSessions: '='
  },
  controller: ['$firebaseAuthService', '$firebaseObject', 'fbRef',
    function ($firebaseAuthService, $firebaseObject, fbRef) {

      this.currentUser = $firebaseObject(fbRef.getUserRef());

      this.getUnreviewedSessionsCount = function () {
        return this.sessions.getUnreviewedCount($firebaseAuthService.$getAuth().uid, this.reviewedSessions);
      }
    }]
});