var app = angular.module('app', ['ngRoute', 'firebase', 'ngAnimate']);

app.run(function($rootScope, $location, $firebaseAuthService, 
    currentUser, $firebaseObject, $firebaseRef) {
  
  $rootScope.$on("$routeChangeError", function(e, next, prev, err) {
    if(err === "AUTH_REQUIRED") {
      $location.path("/login");
    }
    if(err === 'NOT_AUTHORIZED') {
      $location.path("/home");
    }
  })
  
  $firebaseAuthService.$onAuth(function(userObject) {
    if(userObject) {
      currentUser.uid = userObject.uid;
      currentUser.email = userObject.password.email;
      $firebaseObject($firebaseRef.default.child('users')
        .child(userObject.uid)).$loaded().then(function(userData) {
        currentUser.firstName = userData.firstName;
        currentUser.lastName = userData.lastName;
        currentUser.uid = userObject.uid;
        currentUser.isAdmin = userData.isAdmin;
        
      })
    }
  })
})

app.config(function($routeProvider) {
  var routeResolvers = {
    requireAdmin: function($firebaseAuthService, routeAuth) {
      return $firebaseAuthService.$waitForAuth().then(function() {
        console.log('checking route');
        return routeAuth.requireAdmin();  
      })
    }
  }
  
  $routeProvider
    .when('/admin/login', {
      template: '<admin-login current-auth="$resolve.currentAuth"></admin-login>',
      resolve: {
        currentAuth: function($firebaseAuthService) {
          return $firebaseAuthService.$waitForAuth();
        }
      }
    })
    .when('/admin/home', {
      template: '<admin-home></admin-home>',
      resolve: {
        currentAuth: function($firebaseAuthService) {
          return $firebaseAuthService.$requireAuth();
        },
        admin: routeResolvers.requireAdmin 
      }
    })
    .when('/home', {
      template: '<home reviewed-sessions="$resolve.reviewedSessions" sessions="$resolve.sessions" user-sessions="$resolve.userSessions"></home>',
      resolve: {
        currentAuth: function($firebaseAuthService) {
          return $firebaseAuthService.$requireAuth();
        },
        userSessions: function($firebaseAuthService, fbRef, $firebaseArray) {
          return $firebaseAuthService.$requireAuth().then(function() {
            var query = fbRef.getUserSessionsRef().orderByChild("title");
            return $firebaseArray(query).$loaded();
          })
        },
        sessions: function($firebaseAuthService, fbRef, sessionCollection) {
          return $firebaseAuthService.$requireAuth().then(function() {
            var query = fbRef.getSessionsRef();
            return sessionCollection(query).$loaded()
          })
        },
        // reviewedSessions: function($firebaseAuthService, fbRef, $firebaseArray) {
        //   return $firebaseAuthService.$requireAuth().then(function() {
        //     var query = fbRef.getReviewedSessionsRef();
        //     return $firebaseArray(query).$loaded()
        //   })
        // },
        reviewedSessions: function($firebaseAuthService, fbRef, $firebaseObject) {
          return $firebaseAuthService.$requireAuth().then(function() {
            var query = fbRef.getReviewedSessionsRef();
            return $firebaseObject(query).$loaded()
          })
        }
      }
    })
    .when('/admin/createusers', {
      template: '<admin-create-users users="$resolve.users"></admin-create-users>',
      resolve: {
        users: function($firebaseAuthService, fbRef, $firebaseArray) {
          return $firebaseAuthService.$requireAuth().then(function() {
            var query = fbRef.getUsersRef().orderByChild("firstName");
            return $firebaseArray(query).$loaded()
          })
        },
        admin: routeResolvers.requireAdmin
      }
    })
    .when('/createsession', {
      template: '<create-new-session reviewed-sessions="$resolve.reviewedSessions" user-sessions="$resolve.userSessions" sessions="$resolve.sessions"></create-new-session>',
      resolve: {
        userSessions: function($firebaseAuthService, fbRef, $firebaseArray) {
          return $firebaseAuthService.$requireAuth().then(function() {
            var query = fbRef.getUserSessionsRef().orderByChild("title");
            return $firebaseArray(query).$loaded()
          })
        },
        sessions: function($firebaseAuthService, fbRef, sessionCollection) {
          return $firebaseAuthService.$requireAuth().then(function() {
            var query = fbRef.getSessionsRef();
            return sessionCollection(query).$loaded()
          })
        },
        reviewedSessions: function($firebaseAuthService, fbRef, $firebaseObject) {
          return $firebaseAuthService.$requireAuth().then(function() {
            var query = fbRef.getReviewedSessionsRef();
            return $firebaseObject(query).$loaded()
          })
        }
      }
    })
    .when('/login', {
      template: '<login current-auth="$resolve.currentAuth"></login>',
      resolve: {
        currentAuth: function($firebaseAuthService) {
          return $firebaseAuthService.$waitForAuth();
        }
      }
    })
    .when('/logout', {
      template: '<logout></logout>'
    })
    // .when('/userpref', {
    //   template: '<edit-user-pref user-preferences="$resolve.userPreferences"></edit-user-pref>',
    //   resolve: {
    //     userPreferences: function(fbRef, $firebaseObject, auth) {
    //       return auth.$requireAuth().then(function() {
    //         return $firebaseObject(fbRef.getPreferencesRef()).$loaded();
    //       })
    //     }
    //   }
    // })
    // .when('/categories', {
    //   template: '<category-list categories="$resolve.categories"></category-list>',
    //   resolve: {
    //     categories: function(fbRef, $firebaseArray, auth) {
    //       return auth.$requireAuth().then(function() {
    //         var query = fbRef.getCategoriesRef().orderByChild("name");
    //         return $firebaseArray(query).$loaded();
    //       })
    //     }
    //   }
    // })
    // .when('/login', {
    //   template: '<login current-auth="$resolve.currentAuth"></login>',
    //   resolve: {
    //     currentAuth: function(auth) {
    //       return auth.$waitForAuth();
    //     }
    //   }
    // })
    // .when('/logout', {
    //   template: '<logout></logout>'
    // })
    .otherwise('/home')
})