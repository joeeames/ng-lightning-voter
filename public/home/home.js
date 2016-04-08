angular.module('app').component('home', {
  templateUrl: '/home/home.html',
  bindings: {
    userSessions: '=',
    sessions: '=',
    reviewedSessions: '='
  },
  controller: function($firebaseAuthService) {
    
    this.setNextSessionToReview = function() {
      this.currentSessionToReview = 
        this.sessions.getNextUnreviewedSession($firebaseAuthService.$getAuth().uid, this.reviewedSessions);
    }
    this.setNextSessionToReview();
    
    this.getUnreviewedSessionsCount = function() {
      return this.sessions.getUnreviewedCount($firebaseAuthService.$getAuth().uid, this.reviewedSessions);
    }

    this.delete = function(userSession) {
      var found = this.sessions.find(function(s) {
        return s.userSessionKey === userSession.$id
      });
      this.sessions.$remove(found);
      this.userSessions.$remove(userSession);
    }
          
    this.voteYes = function() {
      this.reviewedSessions[this.currentSessionToReview.$id] = 'yes';
      this.currentSessionToReview.voteCount++; 
      this.sessions.$save(this.currentSessionToReview);
      this.reviewedSessions.$save();
      this.setNextSessionToReview();
    }
    
    this.voteNo = function() {
      console.log('vote no')
      this.reviewedSessions[this.currentSessionToReview.$id] = 'no';
      this.reviewedSessions.$save();
      this.setNextSessionToReview();
    }
  }
})