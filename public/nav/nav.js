angular.module('app').component('nav', {
  templateUrl: '/nav/nav.html',
  bindings: {
    currentAuth: '=',
    sessions: '=',
    reviewedSessions: '='
  },
  controller: function(currentUser) {
    this.currentUser = currentUser;
    
    this.getUnreviewedSessionsCount = function() {
      return this.sessions.getUnreviewedCount(currentUser.uid, this.reviewedSessions);
    }
  }
})