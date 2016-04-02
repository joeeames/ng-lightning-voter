angular.module('app').component('home', {
  templateUrl: '/home/home.html',
  bindings: {
    userSessions: '=',
    sessions: '=',
    reviewedSessions: '='
  },
  controller: function(currentUser) {
    
    this.setNextSessionToReview = function() {
      this.currentSessionToReview = 
        this.sessions.getNextUnreviewedSession(currentUser.uid, this.reviewedSessions);
    }
    this.setNextSessionToReview();
    
          
    this.voteYes = function() {
      this.reviewedSessions[this.currentSessionToReview.$id] = 'yes';
      this.currentSessionToReview.voteCount++; 
      this.sessions.$save(this.currentSessionToReview);
      this.reviewedSessions.$save();
      this.setNextSessionToReview();
    }
    
    this.voteNo = function() {
      this.reviewedSessions[this.currentSessionToReview.$id] = 'no';
      this.reviewedSessions.$save();
      this.setNextSessionToReview();
    }
  }
})