angular.module('app').component('createNewSession', {
  templateUrl: '/home/createNewSession.html',
  bindings: {
    sessions: '=',
    userSessions: '=',
    reviewedSessions: '='
  },
  controller: function($firebaseAuthService, currentUser, $timeout) {
    
    this.create = function() {
      var newUserSession = {
        title: this.title,
        length: parseInt(this.length),
        abstract: this.abstract
      }

      this.userSessions.$add(newUserSession).then((function(ref) {
        var newSession = {
          title: this.title,
          length: parseInt(this.length),
          abstract: this.abstract,
          userKey: $firebaseAuthService.$getAuth().uid,
          userSessionKey: ref.key(),
          userFirstName: currentUser.firstName,
          userLastName: currentUser.lastName,
          voteCount: 0
        }
        this.sessions.$add(newSession);
        
        this.title = "";
        this.length = null;
        this.abstract = "";
      }).bind(this))
      
      this.showMessage = true;
      $timeout((function() {
        this.showMessage = false;
      }).bind(this), 2500)
      
    }
    
  }
})