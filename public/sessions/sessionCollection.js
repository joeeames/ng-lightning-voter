angular.module('app').factory('sessionCollection', function($firebaseArray) {
  var SessionCollection = $firebaseArray.$extend({
    getUnreviewedCount: function(userKey, reviewedSessions) {
      var total = 0;
      angular.forEach(this.$list, function(session) {
        if(userKey !== session.userKey
          && typeof reviewedSessions[session.$id] === 'undefined') {
          total++;
        }
      });
      return total;
    },
    getNextUnreviewedSession: function(userKey, reviewedSessions) {
      var unreviewedSessions = this.$list.filter(function(session) {
        return userKey !== session.userKey
          && typeof reviewedSessions[session.$id] === 'undefined'
      });
      return unreviewedSessions[Math.floor(Math.random() * unreviewedSessions.length)];
    }
  });
  
  return function(ref) {
    return new SessionCollection(ref);
  }
})