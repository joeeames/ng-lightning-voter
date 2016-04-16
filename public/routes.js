app.config(['$routeProvider', function ($routeProvider) {
  var routeResolvers = {
    requireAdmin: ['$firebaseAuthService', 'routeAuth', function ($firebaseAuthService, routeAuth) {
      return $firebaseAuthService.$waitForAuth().then(function () {
        console.log('checking route');
        return routeAuth.requireAdmin();
      })
    }],
    sessions: ['$firebaseAuthService', 'fbRef', 'sessionCollection', function ($firebaseAuthService, fbRef, sessionCollection) {
      return $firebaseAuthService.$requireAuth().then(function () {
        var query = fbRef.getSessionsRef();
        return sessionCollection(query).$loaded()
      })
    }],
    sessionsByVote: ['$firebaseAuthService', 'fbRef', 'sessionCollection', function ($firebaseAuthService, fbRef, sessionCollection) {
      return $firebaseAuthService.$requireAuth().then(function () {
        var query = fbRef.getSessionsRef().orderByChild("voteCount");
        return sessionCollection(query).$loaded()
      })
    }],
    reviewedSessions: ['$firebaseAuthService', 'fbRef', 'sessionCollection', function ($firebaseAuthService, fbRef, $firebaseObject) {
      return $firebaseAuthService.$requireAuth().then(function () {
        var query = fbRef.getReviewedSessionsRef();
        return $firebaseObject(query).$loaded()
      })
    }]
  };

  $routeProvider
    .when('/admin/login', {
      template: '<admin-login current-auth="$resolve.currentAuth"></admin-login>',
      resolve: {
        currentAuth: ['$firebaseAuthService', function ($firebaseAuthService) {
          return $firebaseAuthService.$waitForAuth();
        }]
      }
    })
    .when('/admin/home', {
      template: '<admin-home sessions="$resolve.sessions" reviewed-sessions="$resolve.reviewedSessions"></admin-home>',
      resolve: {
        admin: routeResolvers.requireAdmin,
        sessions: routeResolvers.sessionsByVote,
        reviewedSessions: routeResolvers.reviewedSessions
      }
    })
    .when('/home', {
      template: '<home reviewed-sessions="$resolve.reviewedSessions" sessions="$resolve.sessions" user-sessions="$resolve.userSessions"></home>',
      resolve: {
        userSessions: ['$firebaseAuthService', 'fbRef', '$firebaseArray', function ($firebaseAuthService, fbRef, $firebaseArray) {
          return $firebaseAuthService.$requireAuth().then(function () {
            var query = fbRef.getUserSessionsRef().orderByChild("title");
            return $firebaseArray(query).$loaded();
          })
        }],
        sessions: routeResolvers.sessions,
        reviewedSessions: routeResolvers.reviewedSessions
      }
    })
    .when('/admin/createusers', {
      template: '<admin-create-users reviewed-sessions="$resolve.reviewedSessions" sessions="$resolve.sessions" users="$resolve.users"></admin-create-users>',
      resolve: {
        users: ['$firebaseAuthService', 'fbRef', '$firebaseArray', function ($firebaseAuthService, fbRef, $firebaseArray) {
          return $firebaseAuthService.$requireAuth().then(function () {
            var query = fbRef.getUsersRef().orderByChild("firstName");
            return $firebaseArray(query).$loaded()
          })
        }],
        admin: routeResolvers.requireAdmin,
        sessions: routeResolvers.sessions,
        reviewedSessions: routeResolvers.reviewedSessions
      }
    })
    .when('/profile', {
      template: '<profile user-data="$resolve.userData" reviewed-sessions="$resolve.reviewedSessions" sessions="$resolve.sessions" ></home>',
      resolve: {
        userData: function ($firebaseAuthService, fbRef, $firebaseObject) {
          return $firebaseAuthService.$requireAuth().then(function () {
            var query = fbRef.getUserRef()
            return $firebaseObject(query).$loaded();
          })
        },
        sessions: routeResolvers.sessions,
        reviewedSessions: routeResolvers.reviewedSessions
      }
    })
    .when('/createsession', {
      template: '<create-new-session user-profile="$resolve.userProfile" reviewed-sessions="$resolve.reviewedSessions" user-sessions="$resolve.userSessions" sessions="$resolve.sessions"></create-new-session>',
      resolve: {
        userSessions: ['$firebaseAuthService', 'fbRef', '$firebaseArray', function ($firebaseAuthService, fbRef, $firebaseArray) {
          return $firebaseAuthService.$requireAuth().then(function () {
            var query = fbRef.getUserSessionsRef().orderByChild("title");
            return $firebaseArray(query).$loaded()
          })
        }],
        sessions: routeResolvers.sessions,
        reviewedSessions: routeResolvers.reviewedSessions,
        userProfile: ['$firebaseAuthService', 'fbRef', '$firebaseObject', function ($firebaseAuthService, fbRef, $firebaseObject) {
          return $firebaseAuthService.$requireAuth().then(function () {
            var query = fbRef.getUserRef();
            return $firebaseObject(query).$loaded();
          })
        }]
      }
    })
    .when('/login', {
      template: '<login current-auth="$resolve.currentAuth"></login>',
      resolve: {
        currentAuth: ['$firebaseAuthService',function ($firebaseAuthService) {
          return $firebaseAuthService.$waitForAuth();
        }]
      }
    })
    .when('/logout', {
      template: '<logout></logout>'
    })
    .otherwise('/home')
}]);